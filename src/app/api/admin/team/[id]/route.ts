import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/api/db";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const targetId = id;

        const targetUser = await prisma.user.findUnique({ where: { id: targetId } });
        if (!targetUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (targetUser.role === "ADMIN") {
            return NextResponse.json({ error: "Cannot suspend other Admins" }, { status: 403 });
        }

        await prisma.user.delete({
            where: { id: targetId }
        });

        await prisma.auditLog.create({
            data: {
                username: session.user.name || "System",
                type: "SYSTEM",
                action: "REVOKED_STAFF_ACCOUNT",
                details: `Revoked operative ${targetUser.email} [${targetId}]`
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Failed to revoke staff:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
