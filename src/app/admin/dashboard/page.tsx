import { prisma } from "@/api/db";
import { LayoutDashboard, TrendingUp, Package, AlertCircle } from "lucide-react";
import { DashboardCharts } from "./DashboardCharts";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF" && session.user.role !== "SUPER_ADMIN")) {
        redirect("/auth/signin");
    }

    // 1. Core Metrics
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalOrders, todayOrders, inventory, alerts] = await Promise.all([
        prisma.order.aggregate({ _sum: { total: true }, _count: { id: true } }),
        prisma.order.aggregate({ where: { createdAt: { gte: startOfDay } }, _sum: { total: true }, _count: { id: true } }),
        prisma.amulet.aggregate({ _sum: { stock: true } }),
        prisma.order.findMany({ where: { status: { in: ['PENDING', 'PAID'] } }, orderBy: { createdAt: 'asc' }, take: 10 })
    ]);

    // 2. Chart Data Generation (Last 7 Days)
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const dEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);

        const dailyStats = await prisma.order.aggregate({
            where: { createdAt: { gte: dStart, lt: dEnd } },
            _sum: { total: true }
        });

        chartData.push({
            date: dStart.toLocaleDateString('en-US', { weekday: 'short' }),
            revenue: dailyStats._sum.total || 0
        });
    }

    return (
        <div className="p-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-serif text-[#f5ebd7] tracking-widest uppercase mb-2 flex items-center gap-3">
                    <LayoutDashboard className="w-8 h-8 text-[#c4a265]" />
                    管控大屏 (Dashboard)
                </h2>
                <p className="text-[#a39783] text-sm tracking-wide">
                    Enterprise vault telemetrics and real-time operational insights.
                </p>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#1a1814] border border-[#c4a265]/10 p-6 rounded-xl hover:border-[#c4a265]/30 transition-colors shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-[#c4a265]/10 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-[#c4a265]" />
                        </div>
                        <span className="text-xs text-[#a39783] font-mono select-none">ALL TIME</span>
                    </div>
                    <p className="text-3xl font-bold font-serif text-[#f5ebd7] mb-1">
                        ${(totalOrders._sum.total || 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-[#a39783] tracking-widest uppercase font-mono">Gross Volume</p>
                </div>

                <div className="bg-[#1a1814] border border-[#c4a265]/10 p-6 rounded-xl hover:border-[#c4a265]/30 transition-colors shadow-lg relative overflow-hidden group">
                    {/* Gloss effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#c4a265]/0 via-[#c4a265]/0 to-[#c4a265]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-4 relative">
                        <div className="p-3 bg-green-900/20 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-500" />
                        </div>
                        <span className="text-xs text-[#a39783] font-mono select-none">TODAY</span>
                    </div>
                    <p className="text-3xl font-bold font-serif text-[#f5ebd7] mb-1 relative">
                        ${(todayOrders._sum.total || 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-[#a39783] tracking-widest uppercase font-mono relative">Today's Revenue</p>
                </div>

                <div className="bg-[#1a1814] border border-[#c4a265]/10 p-6 rounded-xl hover:border-[#c4a265]/30 transition-colors shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-900/20 rounded-lg">
                            <Package className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className="text-xs text-[#a39783] font-mono select-none">GLOBAL</span>
                    </div>
                    <p className="text-3xl font-bold font-serif text-[#f5ebd7] mb-1">
                        {inventory._sum.stock || 0}
                    </p>
                    <p className="text-xs text-[#a39783] tracking-widest uppercase font-mono">Vault Capacity</p>
                </div>

                <div className="bg-[#1a1814] border border-[#c4a265]/10 p-6 rounded-xl hover:border-red-500/30 transition-colors shadow-lg relative">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-900/20 rounded-lg">
                            <AlertCircle className={`w-6 h-6 ${alerts.length > 0 ? 'text-red-500 animate-pulse' : 'text-[#8c8273]'}`} />
                        </div>
                        <span className="text-[10px] text-red-500 font-bold bg-red-900/20 px-2 py-1 rounded select-none">ACTION</span>
                    </div>
                    <p className="text-3xl font-bold font-serif text-[#f5ebd7] mb-1">
                        {alerts.length}
                    </p>
                    <p className="text-xs text-[#a39783] tracking-widest uppercase font-mono">Pending Shipments</p>
                </div>
            </div>

            {/* Charts & Lists Area */}
            <DashboardCharts data={chartData} alerts={alerts} />

        </div>
    )
}
