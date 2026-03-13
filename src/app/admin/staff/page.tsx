import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/api/db";
import { Users } from "lucide-react";
import StaffManagementClient from "./StaffManagementClient";

export default async function AdminStaffPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        redirect("/admin"); // Redirect restricted Staff away
    }

    // Fetch all staff and super admins
    const staffMembers = await prisma.user.findMany({
        where: {
            role: {
                in: ["STAFF", "SUPER_ADMIN", "ADMIN"]
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="p-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-8 border-b border-[#c4a265]/20 pb-6">
                <h2 className="text-3xl font-serif text-[#c4a265] tracking-widest uppercase mb-2 flex items-center gap-3">
                    <Users className="w-8 h-8" />
                    员工管理与权限分发 (Staff Matrix)
                </h2>
                <p className="text-[#a39783] text-sm tracking-wide">
                    Super Admin Only. Delegate specific module access to internal system employees.
                </p>
            </div>

            <StaffManagementClient initialStaff={staffMembers} />
        </div>
    );
}
