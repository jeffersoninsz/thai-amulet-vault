import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/api/db";

// Force Super Admin constraint
const isSuperAdmin = (session: any) => {
    return session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "ADMIN";
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!isSuperAdmin(session)) {
            return NextResponse.json({ error: "Unauthorized. Super Admin clearance required." }, { status: 403 });
        }

        const body = await req.json();
        const { userId, role, permissions } = body;

        if (!userId) {
            return NextResponse.json({ error: "Missing target userId" }, { status: 400 });
        }

        const updateData: any = {};

        // Mutating Global Role
        if (role) {
            if (!["STAFF", "ADMIN", "SUPER_ADMIN", "USER", "WHOLESALE"].includes(role)) {
                return NextResponse.json({ error: "Invalid role payload" }, { status: 400 });
            }
            updateData.role = role;
        }

        // Mutating JSON Permissions
        if (permissions !== undefined) {
            updateData.permissions = permissions;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        // Audit Trail
        await prisma.auditLog.create({
            data: {
                username: session?.user?.name || session?.user?.email || "UnknownAdmin",
                type: "SYSTEM",
                action: `UPDATE_STAFF_PERMISSIONS`,
                targetId: userId,
                details: `Set role: ${role || 'N/A'}, perms: ${permissions || 'N/A'}`
            }
        });

        return NextResponse.json(updatedUser, { status: 200 });

    } catch (error: any) {
        console.error("STAFF API ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
