import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/api/db";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized or insufficient permissions." }, { status: 403 });
        }

        const data = await req.json();

        // Ensure we only update the fields that exist in SiteConfig model
        const updatedConfig = await prisma.siteConfig.update({
            where: { id: "global_config" },
            data: {
                heroTitleZh: data.heroTitleZh,
                heroTitleEn: data.heroTitleEn,
                heroDescZh: data.heroDescZh,
                heroDescEn: data.heroDescEn,
                baseVisitorCount: parseInt(data.baseVisitorCount),
                isVisitorCounterEnabled: Boolean(data.isVisitorCounterEnabled),
                visitorIncrementRate: parseInt(data.visitorIncrementRate || 5),
                visitorJumpInterval: parseInt(data.visitorJumpInterval || 12),
                isSalesPopupEnabled: Boolean(data.isSalesPopupEnabled),
                salesPopupFrequency: parseInt(data.salesPopupFrequency || 15),
                announcementBarZh: data.announcementBarZh || null,
                announcementBarEn: data.announcementBarEn || null,
                isStripeEnabled: Boolean(data.isStripeEnabled),
                isOfferEnabled: Boolean(data.isOfferEnabled),
                // Banner Management
                ...(data.bannerPcUrl !== undefined && { bannerPcUrl: data.bannerPcUrl }),
                ...(data.bannerMobUrl !== undefined && { bannerMobUrl: data.bannerMobUrl }),
                ...(data.bannerType !== undefined && { bannerType: data.bannerType }),
            }
        });

        await prisma.auditLog.create({
            data: {
                username: session.user.email || "ADMIN",
                type: "WRITE",
                action: "UPDATED_SITE_CONFIG",
                details: "Updated global site configurations and marketing triggers."
            }
        });

        // Ensure global layouts fetch new changes instantly
        revalidatePath("/", "layout");

        return NextResponse.json({ success: true, config: updatedConfig });
    } catch (error) {
        console.error("Error updating site config:", error);
        return NextResponse.json({ error: "Failed to update configuration." }, { status: 500 });
    }
}
