import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./components/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    // Strict RBAC: Must be SUPER_ADMIN, ADMIN (legacy), or STAFF
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN" && session.user.role !== "STAFF")) {
        redirect("/auth/signin");
    }

    const role = session.user.role as "ADMIN" | "SUPER_ADMIN" | "STAFF";
    const name = session.user.name || session.user.email || "Staff Member";
    const isSuper = role === "SUPER_ADMIN" || role === "ADMIN";

    // Parse permissions (e.g. '["MANAGE_ORDERS", "MANAGE_CONTENT"]')
    let staffPerms: string[] = [];
    if (role === "STAFF" && session.user.permissions) {
        try {
            staffPerms = JSON.parse(session.user.permissions);
        } catch (e) { }
    }
    const canSeeOrders = isSuper || staffPerms.includes("MANAGE_ORDERS");
    const canSeeContent = isSuper || staffPerms.includes("MANAGE_CONTENT");
    const canSeeVault = isSuper || staffPerms.includes("MANAGE_VAULT");

    return (
        <div className="flex flex-col md:flex-row h-screen bg-[#0d0c0b] text-[#d4c5b0] overflow-hidden font-sans pt-16 md:pt-0">
            <AdminSidebar
                canSeeVault={canSeeVault}
                canSeeOrders={canSeeOrders}
                canSeeContent={canSeeContent}
                isSuper={isSuper}
                userName={name}
                userRole={role}
            />

            {/* Main Content Pane */}
            <main className="flex-1 flex flex-col overflow-hidden bg-[#0a0908]">
                <div className="flex-1 overflow-y-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
