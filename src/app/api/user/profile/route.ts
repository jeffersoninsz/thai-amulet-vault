import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/api/db";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { name, password } = await req.json();

        let updateData: any = {};
        if (name) updateData.name = name;
        if (password && password.length >= 8) {
            updateData.passwordHash = await bcrypt.hash(password, 10);
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No updates provided or password too short." }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData
        });

        // Re-issue or client-side NextAuth requires re-login usually on password change or we return success and tell client to re-auth
        return NextResponse.json({ success: true, name: user.name });

    } catch (error) {
        console.error("Failed to update profile", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
