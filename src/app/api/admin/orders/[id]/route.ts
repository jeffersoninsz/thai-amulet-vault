import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/api/db";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { status, trackingNumber, trackingProvider, total } = body;

        const updateData: any = {};
        if (status !== undefined) updateData.status = status;
        if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
        if (trackingProvider !== undefined) updateData.trackingProvider = trackingProvider;
        if (total !== undefined) updateData.total = parseFloat(total);

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: updateData
        });

        await prisma.auditLog.create({
            data: {
                username: session.user.name || session.user.email || "System",
                type: "WRITE",
                action: "UPDATE_ORDER_STATUS",
                targetId: id,
                details: `Updated order status to ${status}`
            }
        });

        return NextResponse.json(updatedOrder);

    } catch (error) {
        console.error("Failed to update order:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
