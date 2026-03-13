import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/api/db";
import { PackageSearch, Clock, PackageCheck, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { Amulet } from "@prisma/client";

export default async function OrdersPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) return null;

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
            items: {
                include: { amulet: true }
            }
        }
    });

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div>
                <h2 className="text-3xl font-serif text-[#f5ebd7] tracking-widest uppercase mb-2">Order History</h2>
                <p className="text-[#a39783] text-sm">Review your past holy artifact acquisitions and shipping status.</p>
            </div>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-24 text-[#a39783] border border-dashed border-[#c4a265]/20 bg-[#1a1814]/30 rounded-lg">
                    <PackageSearch className="w-16 h-16 text-[#c4a265]/50 mb-4" />
                    <p className="font-serif italic text-lg text-[#d4c5b0]">Your collection journey begins here.</p>
                    <p className="text-sm mt-2 opacity-80">You have no previous orders.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-[#1a1814]/50 border border-[#c4a265]/20 rounded-xl overflow-hidden shadow-lg">
                            {/* Order Header */}
                            <div className="bg-[#1a1814] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between border-b border-[#c4a265]/10 gap-4">
                                <div>
                                    <p className="text-[#a39783] text-xs font-mono uppercase tracking-widest mb-1">Order #{order.id.slice(-8).toUpperCase()}</p>
                                    <p className="text-[#f5ebd7] text-sm flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-[#c4a265]" />
                                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                <div className="text-right flex items-center md:items-end flex-row md:flex-col justify-between">
                                    <span className="font-serif text-[#c4a265] text-xl font-bold">${order.total.toFixed(2)}</span>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest mt-2 border ${order.status === "PENDING" ? "bg-amber-900/30 text-amber-500 border-amber-500/50" :
                                            order.status === "SHIPPED" ? "bg-blue-900/30 text-blue-400 border-blue-500/50" :
                                                order.status === "DELIVERED" ? "bg-green-900/30 text-green-400 border-green-500/50" :
                                                    "bg-[#c4a265]/20 text-[#c4a265] border-[#c4a265]/50"
                                        }`}>
                                        {order.status === "DELIVERED" && <PackageCheck className="w-3 h-3" />}
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <ul className="space-y-4">
                                    {order.items.map(item => (
                                        <li key={item.id} className="flex gap-4">
                                            <div className="w-16 h-20 bg-[#0d0c0b] rounded overflow-hidden shrink-0 border border-[#c4a265]/10">
                                                <img src={item.amulet.imageUrl} alt="" className="w-full h-full object-cover opacity-80" />
                                            </div>
                                            <div>
                                                <Link href={`/amulet/${item.amulet.id}`} className="text-[#d4c5b0] hover:text-[#c4a265] font-serif transition-colors line-clamp-1">
                                                    {item.amulet.nameEn || item.amulet.nameZh}
                                                </Link>
                                                <p className="text-[#a39783] text-xs mt-1">{item.amulet.monkOrTemple} · {item.amulet.year}</p>
                                                <p className="text-[#a39783] text-xs mt-1">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* Shipping Details Sync */}
                                <div className="mt-6 pt-4 border-t border-[#c4a265]/10 flex flex-col sm:flex-row gap-4 justify-between items-start text-sm">
                                    <div className="text-[#8c8273] flex gap-2 w-full max-w-sm">
                                        <MapPin className="w-4 h-4 text-[#c4a265] shrink-0 mt-0.5" />
                                        <span className="leading-relaxed">{order.snapAddress} <br /> Ph: {order.snapPhone}</span>
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 border border-[#c4a265]/30 text-[#c4a265] rounded hover:bg-[#c4a265]/10 transition-colors shrink-0">
                                        <Search className="w-4 h-4" /> Track Manifest
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
