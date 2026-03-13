import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUsers } from "@/api/db";
import CustomerManager from "./CustomerManager";

export default async function CustomersPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF" && session.user.role !== "SUPER_ADMIN")) {
        redirect("/auth/signin");
    }

    const users = await getUsers();

    return (
        <div className="min-h-screen bg-[#0a0908]">
            <CustomerManager initialUsers={users} />
        </div>
    );
}
