import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/api/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { email, password, name, role } = await req.json();

        if (!email || !password || password.length < 8) {
            return NextResponse.json({ error: "Invalid credentials. Password min 8 chars." }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "User already exists." }, { status: 400 });
        }

        const hash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                passwordHash: hash,
                role: "STAFF" // Force STAFF role for safety
            },
            select: { id: true, name: true, email: true, role: true }
        });

        await prisma.auditLog.create({
            data: {
                username: session.user.name || session.user.email || "System",
                type: "SYSTEM",
                action: "CREATED_STAFF_ACCOUNT",
                details: `Authorized newly appointed operative: ${email}`
            }
        });

        return NextResponse.json({ success: true, user: newUser });

    } catch (error) {
        console.error("Failed to create staff:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
