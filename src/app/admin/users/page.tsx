import { prisma } from "@/api/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserListClient from "./UserListClient";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { appendLog } from "@/api/logger";

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        redirect("/admin");
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
    });

    // Task 1: Add Read audit point
    await appendLog(
        session.user.name || session.user.email || "Unknown User",
        "查看用户管理",
        "SYSTEM_USERS",
        "查看了所有用户列表",
        "READ"
    );

    return (
        <main className="min-h-screen bg-[#0d0c0b] text-[#d4c5b0] pt-20">
            <nav className="fixed top-0 w-full z-50 bg-[#0d0c0b]/80 backdrop-blur-md border-b border-[#c4a265]/10 px-6 h-20 flex items-center justify-between">
                <Link
                    href="/admin"
                    className="flex items-center gap-2 text-[#a39783] hover:text-[#c4a265] transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="tracking-widest text-sm">返回中心</span>
                </Link>
                <div className="flex gap-4">
                    <div className="text-xl font-serif font-bold text-[#c4a265] tracking-widest border-l border-[#c4a265]/20 pl-4 items-center flex">
                        USER<span className="text-[#f5ebd7]">MANAGEMENT</span>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-serif text-[#f5ebd7] mb-8 flex items-center gap-3">
                    <Users className="w-8 h-8 text-[#c4a265]" />
                    殿堂守护者与信众 (RBAC)
                </h1>

                <UserListClient initialUsers={users} currentUserId={session.user.id} />
            </div>
        </main>
    );
}
