import { ScrollText } from "lucide-react";
import { prisma } from "@/api/db";
import { AdminOrderManager } from "./AdminOrderManager";

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: true,
            items: {
                include: { amulet: true }
            }
        }
    });

    return (
        <div className="p-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-serif text-[#f5ebd7] tracking-widest uppercase mb-2 flex items-center gap-3">
                    <ScrollText className="w-8 h-8 text-[#c4a265]" />
                    订单中心 (Order Management)
                </h2>
                <p className="text-[#a39783] text-sm tracking-wide">
                    View global customer acquisitions and update logistics statuses.
                </p>
            </div>

            <AdminOrderManager initialOrders={orders} />
        </div>
    );
}
