"use server";

import { updateAmulet } from "@/api/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ── 统一 RBAC 辅助函数 ──────────────────────────────────────
const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN", "STAFF"];
const SUPER_ROLES = ["ADMIN", "SUPER_ADMIN"];

function isAdminOrStaff(role: string | undefined): boolean {
    return !!role && ADMIN_ROLES.includes(role);
}

function isSuperAdmin(role: string | undefined): boolean {
    return !!role && SUPER_ROLES.includes(role);
}

export async function updateAmuletAction(id: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !isAdminOrStaff(session.user.role)) {
        throw new Error("Unauthorized");
    }

    const updates: any = {
        nameZh: formData.get("nameZh") as string,
        nameEn: formData.get("nameEn") as string,
        monkOrTemple: formData.get("monkOrTemple") as string,
        year: formData.get("year") as string,
        materialZh: formData.get("materialZh") as string,
        materialEn: formData.get("materialEn") as string,
        descZh: formData.get("descZh") as string,
        descEn: formData.get("descEn") as string,
        imageUrl: formData.get("imageUrl") as string,
        price: parseFloat(formData.get("price") as string) || 88.0,
        stock: parseInt(formData.get("stock") as string, 10) || 0,
        moq: parseInt(formData.get("moq") as string, 10) || 1,
        isB2bOnly: formData.get("isB2bOnly") === "on",
    };

    console.log(`[updateAmuletAction] ID: ${id}, ImageURL: ${updates.imageUrl}`);

    const wholesalePriceStr = formData.get("wholesalePrice") as string;
    if (wholesalePriceStr && !isNaN(parseFloat(wholesalePriceStr))) {
        updates.wholesalePrice = parseFloat(wholesalePriceStr);
    } else {
        updates.wholesalePrice = null;
    }

    const success = await updateAmulet(id, updates);
    if (success) {
        const { appendLog } = await import("@/api/logger");
        await appendLog(
            session.user.name || session.user.email || "Unknown User",
            "更新圣物档案",
            id,
            `更新了: ${updates.nameZh} | Image: ${updates.imageUrl?.substring(0, 50)}...`,
            "WRITE"
        );

        revalidatePath("/admin");
        revalidatePath("/");
        revalidatePath(`/amulet/${id}`);
    } else {
        console.error(`[updateAmuletAction] FAILED for ID: ${id}`);
    }
    return { success };
}

export async function createAmuletAction(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !isAdminOrStaff(session.user.role)) {
        throw new Error("Unauthorized");
    }

    const newAmuletData: any = {
        nameZh: formData.get("nameZh") as string || "新佛牌",
        nameEn: formData.get("nameEn") as string || "New Amulet",
        nameTh: formData.get("nameTh") as string || "",
        monkOrTemple: formData.get("monkOrTemple") as string || "未知 (Unknown)",
        year: formData.get("year") as string || "2566",
        materialZh: formData.get("materialZh") as string || "粉牌",
        materialEn: formData.get("materialEn") as string || "Powder",
        descZh: formData.get("descZh") as string || "",
        descEn: formData.get("descEn") as string || "",
        descTh: formData.get("descTh") as string || "",
        imageUrl: formData.get("imageUrl") as string || "/images/siam_treasure_placeholder.png",
        price: parseFloat(formData.get("price") as string) || 88.0,
        stock: parseInt(formData.get("stock") as string, 10) || 1,
        moq: parseInt(formData.get("moq") as string, 10) || 1,
        isB2bOnly: formData.get("isB2bOnly") === "on",
    };

    const wholesalePriceStr = formData.get("wholesalePrice") as string;
    if (wholesalePriceStr && !isNaN(parseFloat(wholesalePriceStr))) {
        newAmuletData.wholesalePrice = parseFloat(wholesalePriceStr);
    }

    try {
        const newAmulet = await prisma.amulet.create({
            data: newAmuletData
        });

        const { appendLog } = await import("@/api/logger");
        await appendLog(
            session.user.name || session.user.email || "Unknown User",
            "新增圣物档案",
            newAmulet.id,
            `新增了: ${newAmulet.nameZh}`,
            "WRITE"
        );

        revalidatePath("/admin");
        revalidatePath("/");

        return { success: true, newId: newAmulet.id };
    } catch (e) {
        console.error("Failed to create amulet:", e);
        return { success: false, error: "Database error" };
    }
}

export async function deleteAmuletAction(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        throw new Error("Unauthorized");
    }

    try {
        const deleted = await prisma.amulet.delete({
            where: { id }
        });

        const { appendLog } = await import("@/api/logger");
        await appendLog(
            session.user.name || session.user.email || "Unknown User",
            "删除了圣物",
            id,
            `删除了: ${deleted.nameZh}`,
            "WRITE"
        );

        revalidatePath("/admin");
        revalidatePath("/");

        return { success: true };
    } catch (e) {
        console.error("Failed to delete amulet:", e);
        return { success: false, error: "Delete failed" };
    }
}

import { cookies } from "next/headers";

export async function loginAction(password: string) {
    if (password === "admin123") {
        const cookieStore = await cookies();
        cookieStore.set("admin_token", "authenticated", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        });
        return { success: true };
    }
    return { success: false };
}

import { updateSiteSetting } from "@/api/settings";
import { prisma } from "@/api/db";

export async function updateSiteSettingsAction(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !isSuperAdmin(session.user.role)) {
        throw new Error("Unauthorized");
    }

    try {
        const settings: Record<string, string> = {
            ENABLE_TOASTS: formData.get("ENABLE_TOASTS") as string,
            ENABLE_VISITORS: formData.get("ENABLE_VISITORS") as string,
            BASE_VISITORS: formData.get("BASE_VISITORS") as string,
        };
        for (const [key, value] of Object.entries(settings)) {
            if (value !== null) await updateSiteSetting(key, value);
        }

        const { appendLog } = await import("@/api/logger");
        await appendLog(
            session.user.name || session.user.email || "Unknown User",
            "更新站点设置",
            "SYSTEM",
            `更新了站点全局配置`,
            "WRITE"
        );

        revalidatePath("/");
        revalidatePath("/admin");
        revalidatePath("/admin/settings");
    } catch (e) {
        console.error("Failed to update settings", e);
    }
}

export async function updateUserRoleAction(userId: string, newRole: string, formData?: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !isAdminOrStaff(session.user.role)) {
        throw new Error("Unauthorized");
    }

    if (session.user.id === userId) {
        throw new Error("Cannot change your own role");
    }

    try {
        const companyName = formData && formData.get('companyName') ? formData.get('companyName') as string : undefined;
        const dataToUpdate: any = { role: newRole };
        if (companyName !== undefined) {
            dataToUpdate.companyName = companyName;
        }

        await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate
        });

        const { appendLog } = await import("@/api/logger");
        await appendLog(
            session.user.name || session.user.email || "Unknown User",
            "更新用户角色",
            userId,
            `将用户的角色更改为: ${newRole}`,
            "WRITE"
        );

        revalidatePath("/admin/users");
        return { success: true };
    } catch (e) {
        console.error("Failed to update user role", e);
        return { success: false, error: 'Database error' };
    }
}

export async function postCommentAction(amuletId: string, author: string, content: string, rating: number = 5, imageUrl: string = "") {
    if (!content.trim()) return { success: false, error: 'Empty content' };
    try {
        const imagesArr = imageUrl ? [imageUrl] : [];
        await prisma.comment.create({
            data: {
                amuletId,
                author: author || 'Anonymous',
                content: content.trim(),
                isApproved: true,
                rating,
                images: JSON.stringify(imagesArr),
            }
        });
        revalidatePath(`/amulet/${amuletId}`);
        return { success: true };
    } catch (e) {
        return { success: false, error: 'DB Error' };
    }
}

// -------------------------------------------------------------
// 资讯中心 (ARTICLES) CRUD
// -------------------------------------------------------------
export async function createArticleAction(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        throw new Error("Unauthorized");
    }

    try {
        const titleZh = formData.get("titleZh") as string || "新资讯";
        const newDoc = await prisma.article.create({
            data: {
                titleZh,
                titleEn: formData.get("titleEn") as string || "New Article",
                slug: `article-${Date.now()}`,
                contentZh: formData.get("contentZh") as string || "",
                contentEn: formData.get("contentEn") as string || "",
                category: formData.get("category") as string || "NEWS",
                imageUrl: formData.get("imageUrl") as string || null,
                isPublished: formData.get("isPublished") === "true",
                author: session.user.name || session.user.email || "Admin",
            }
        });

        const { appendLog } = await import("@/api/logger");
        await appendLog(
            session.user.name || session.user.email || "Unknown User",
            "创建了新资讯",
            newDoc.id,
            `标题: ${titleZh}`,
            "WRITE"
        );

        revalidatePath("/admin/articles");
        revalidatePath("/news");
        return { success: true };
    } catch (e) {
        return { success: false, error: "Database error" };
    }
}

export async function updateArticleAction(id: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.article.update({
            where: { id },
            data: {
                titleZh: formData.get("titleZh") as string,
                titleEn: formData.get("titleEn") as string,
                contentZh: formData.get("contentZh") as string,
                contentEn: formData.get("contentEn") as string,
                category: formData.get("category") as string,
                imageUrl: formData.get("imageUrl") as string || null,
                isPublished: formData.get("isPublished") === "true",
            }
        });

        revalidatePath("/admin/articles");
        revalidatePath("/news");
        return { success: true };
    } catch (e) {
        return { success: false, error: "Database error" };
    }
}

export async function deleteArticleAction(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.article.delete({ where: { id } });
        revalidatePath("/admin/articles");
        revalidatePath("/news");
        return { success: true };
    } catch (e) {
        return { success: false, error: "Delete failed" };
    }
}

// -------------------------------------------------------------
// 前端导航管理 (NAVIGATION) CRUD
// -------------------------------------------------------------
export async function createNavigationItemAction(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.navigationItem.create({
            data: {
                group: formData.get("group") as string || "HEADER_MAIN",
                labelZh: formData.get("labelZh") as string || "新链接",
                labelEn: formData.get("labelEn") as string || "New Link",
                href: formData.get("href") as string || "/",
                order: parseInt(formData.get("order") as string, 10) || 0,
            }
        });

        const { appendLog } = await import("@/api/logger");
        await appendLog(
            session.user.name || session.user.email || "Unknown User",
            "新增导航链接",
            "SYSTEM",
            `组别: ${formData.get("group")}, 标签: ${formData.get("labelZh")}`,
            "WRITE"
        );

        revalidatePath("/");
        revalidatePath("/admin/settings");
        return { success: true };
    } catch (e) {
        console.error("Create nav item error", e);
        return { success: false, error: "Database error" };
    }
}

export async function updateNavigationItemAction(id: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.navigationItem.update({
            where: { id },
            data: {
                group: formData.get("group") as string,
                labelZh: formData.get("labelZh") as string,
                labelEn: formData.get("labelEn") as string,
                href: formData.get("href") as string,
                order: parseInt(formData.get("order") as string, 10) || 0,
            }
        });

        revalidatePath("/");
        revalidatePath("/admin/settings");
        return { success: true };
    } catch (e) {
        console.error("Update nav item error", e);
        return { success: false, error: "Database error" };
    }
}

export async function deleteNavigationItemAction(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.navigationItem.delete({ where: { id } });

        revalidatePath("/");
        revalidatePath("/admin/settings");
        return { success: true };
    } catch (e) {
        console.error("Delete nav item error", e);
        return { success: false, error: "Delete failed" };
    }
}

export async function deleteUserAction(userId: string) {
    const session = await getServerSession(authOptions);
    if (!session || !isSuperAdmin(session.user.role)) {
        throw new Error("Unauthorized: Only ADMIN can delete users");
    }

    if (session.user.id === userId) {
        throw new Error("Cannot delete yourself");
    }

    try {
        await prisma.user.delete({
            where: { id: userId }
        });

        const { appendLog } = await import("@/api/logger");
        await appendLog(
            session.user.name || session.user.email || "Unknown User",
            "删除用户记录",
            userId,
            `永久删除了用户帐号`,
            "WRITE"
        );

        revalidatePath("/admin/users");
        return { success: true };
    } catch (e) {
        console.error("Failed to delete user", e);
        return { success: false, error: 'Database error or user not found' };
    }
}
