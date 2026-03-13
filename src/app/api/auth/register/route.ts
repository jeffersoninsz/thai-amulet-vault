import { NextResponse } from "next/server";
import { prisma } from "@/api/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                name: name || email.split("@")[0],
                role: "USER" // Default lowest permission
            }
        });

        // Add to audit log
        await prisma.auditLog.create({
            data: {
                username: "System",
                type: "USER_REGISTER",
                action: "CREATE_ACCOUNT",
                targetId: newUser.id,
                details: `New user registration: ${email}`
            }
        });

        return NextResponse.json({ success: true, user: { email: newUser.email, id: newUser.id } });

    } catch (error: any) {
        console.error("Registration API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
