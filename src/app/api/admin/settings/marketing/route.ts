import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/api/db";

const isPermitted = (session: any) => {
    if (session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "ADMIN") return true;
    if (session?.user?.role === "STAFF" && session?.user?.permissions?.includes("MANAGE_CONTENT")) return true;
    return false;
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!isPermitted(session)) {
            return NextResponse.json({ error: "Unauthorized access to Marketing Modules." }, { status: 403 });
        }

        const body = await req.json();

        const payload = {
            fakePopupsEnabled: Boolean(body.fakeSalesEnabled),
            popupIntervalMin: Number(body.popupIntervalMin),
            popupIntervalMax: Number(body.popupIntervalMax),
            fakeSalesCities: body.fakeSalesCities ? String(body.fakeSalesCities) : undefined,
            fakeSalesNames: body.fakeSalesNames ? String(body.fakeSalesNames) : undefined,
            fakeViewsEnabled: Boolean(body.fakeViewsEnabled),
            baseVisitorCount: Number(body.baseViews),
            visitorIncrementRate: Number(body.viewIncreaseRate),
            visitorTickInterval: Number(body.visitorTickInterval) || 12
        };

        const prismaAny = prisma as any;
        const config = await prismaAny.marketingConfig.upsert({
            where: { id: "global" },
            update: payload,
            create: { id: "global", ...payload }
        });

        // Push to Audit Log
        if (session?.user) {
            await prisma.auditLog.create({
                data: {
                    username: session.user.name || session.user.email || "System",
                    type: "SYSTEM",
                    action: "UPDATE_MARKETING_CONFIG",
                    targetId: "global",
                    details: JSON.stringify(payload).substring(0, 200)
                }
            });
        }

        return NextResponse.json(config);

    } catch (error: any) {
        console.error("Marketing Config API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
