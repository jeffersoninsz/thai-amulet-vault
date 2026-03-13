import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserCog } from "lucide-react";
import { prisma } from "@/api/db";
import { AdminTeamManager } from "./AdminTeamManager";

export default async function AdminTeamPage() {
    const session = await getServerSession(authOptions);

    // Harder check: Only ADMIN can view this page
    if (session?.user?.role !== "ADMIN") {
        redirect("/admin"); // Kick STAFF members out to the dashboard
    }

    const members = await prisma.user.findMany({
        where: {
            role: { in: ['ADMIN', 'STAFF'] }
        },
        orderBy: { role: 'asc' }, // ADMIN first
        select: { id: true, name: true, email: true, role: true }
    });

    return (
        <div className="p-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-8 border-b border-[#c4a265]/20 pb-4">
                <h2 className="text-3xl font-serif text-[#f5ebd7] tracking-widest uppercase mb-2 flex items-center gap-3">
                    <UserCog className="w-8 h-8 text-[#c4a265]" />
                    权限队伍 (Team Management)
                </h2>
                <p className="text-[#a39783] text-sm tracking-wide">
                    View and manage sub-accounts, staff roles, and system access. (ADMIN ONLY)
                </p>
            </div>

            <AdminTeamManager initialTeam={members} />
        </div>
    );
}
