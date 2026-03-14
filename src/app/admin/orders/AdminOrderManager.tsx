"use client";

import { useState } from "react";
import { PackageCheck, ChevronDown, Check, UserIcon, MapPin, Search, X, Eye } from "lucide-react";
import Image from "next/image";

export function AdminOrderManager({ initialOrders }: { initialOrders: any[] }) {
    const [orders, setOrders] = useState(initialOrders);
    const [loading, setLoading] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    // Edit states for drawer
    const [editTotal, setEditTotal] = useState("");
    const [editTrackingNumber, setEditTrackingNumber] = useState("");
    const [editTrackingProvider, setEditTrackingProvider] = useState("");

    const handleSelectOrder = (order: any) => {
        setSelectedOrder(order);
        setEditTotal(order.total?.toString() || "0");
        setEditTrackingNumber(order.trackingNumber || "");
        setEditTrackingProvider(order.trackingProvider || "");
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        setLoading(orderId);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                alert(`订单状态成功更新为 ${newStatus}！`);
                window.location.reload();
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            alert("Error updating status");
        } finally {
            setLoading(null);
        }
    };

    const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED"];

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.snapAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-[0.98] duration-500">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-[#1a1814]/80 p-4 rounded-xl border border-[#c4a265]/20 shadow-lg">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39783]" />
                    <input
                        type="text"
                        placeholder="Search orders, emails, tracing..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0a0908] border border-[#c4a265]/30 rounded-lg py-2 pl-10 pr-4 text-sm text-[#d4c5b0] focus:outline-none focus:border-[#c4a265] transition-colors"
                    />
                </div>
                <div className="flex gap-2 text-xs font-mono uppercase tracking-widest items-center px-4">
                    <span className="text-[#a39783]">Total Acquisitions: </span>
                    <span className="text-[#c4a265] font-bold text-base">{orders.length}</span>
                </div>
            </div>

            {/* Orders Feed */}
            <div className="grid grid-cols-1 gap-6">
                {filteredOrders.length === 0 && (
                    <div className="text-center p-12 text-[#a39783] border border-dashed border-[#c4a265]/20 rounded-xl bg-[#1a1814]/30">
                        {orders.length === 0 ? "No acquisitions have been processed yet." : "No orders match your search."}
                    </div>
                )}

                {filteredOrders.map(order => (
                    <div key={order.id} className="bg-[#1a1814] border border-[#c4a265]/10 hover:border-[#c4a265]/30 rounded-xl overflow-hidden transition-all shadow-xl group">
                        {/* Header Bar */}
                        <div className="bg-[#0a0908]/50 px-6 py-4 border-b border-[#c4a265]/10 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded bg-[#c4a265]/10 border border-[#c4a265]/20 flex items-center justify-center text-[#c4a265]">
                                    <UserIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-[#f5ebd7]">{order.user?.name || "Collector"}</span>
                                        <span className="text-xs text-[#a39783] font-mono select-all opacity-80">{order.user?.email}</span>
                                    </div>
                                    <div className="text-[10px] text-[#8c8273] font-mono tracking-widest uppercase mt-1">
                                        ID: {order.id.slice(0, 8)}...{order.id.slice(-4)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleSelectOrder(order)}
                                    className="px-3 py-1.5 flex items-center gap-2 bg-[#c4a265]/10 text-[#c4a265] border border-[#c4a265]/30 rounded hover:bg-[#c4a265]/20 transition-colors text-xs font-bold uppercase tracking-widest mr-4"
                                >
                                    <Eye className="w-4 h-4" /> 详情 (View)
                                </button>
                                <div className="text-right mr-4 hidden md:block">
                                    <p className="text-[10px] text-[#a39783] font-mono uppercase tracking-widest mb-1">Total Remittance</p>
                                    <p className="font-serif font-bold text-xl text-[#c4a265]">${order.total.toFixed(2)}</p>
                                </div>

                                <div className="relative">
                                    <select
                                        disabled={loading === order.id}
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                        className={`appearance-none font-bold text-xs uppercase tracking-widest px-4 py-2 pr-10 rounded border cursor-pointer hover:bg-opacity-80 transition-all ${order.status === 'PENDING' ? 'bg-amber-900/20 text-amber-500 border-amber-500/50' :
                                            order.status === 'PAID' ? 'bg-[#c4a265]/20 text-[#c4a265] border-[#c4a265]/50' :
                                                order.status === 'SHIPPED' ? 'bg-blue-900/20 text-blue-400 border-blue-500/50' :
                                                    'bg-green-900/20 text-green-400 border-green-500/50'
                                            }`}
                                    >
                                        {STATUSES.map(s => <option key={s} value={s} className="bg-[#0a0908]">{s}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-50" />
                                    {loading === order.id && <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />}
                                </div>
                            </div>
                        </div>

                        {/* Body Details */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
                            <div className="md:col-span-3">
                                <h4 className="text-[10px] text-[#8c8273] uppercase tracking-widest font-mono mb-3 border-b border-[#c4a265]/10 pb-1">Manifest Items</h4>
                                <ul className="space-y-3">
                                    {order.items.map((item: any) => (
                                        <li key={item.id} className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 bg-[#0d0c0b] rounded overflow-hidden shrink-0 border border-[#c4a265]/10">
                                                <Image 
                                                    src={item.amulet.imageUrl || "/images/placeholder-amulet.png"} 
                                                    alt={item.amulet.nameEn || "Amulet"} 
                                                    fill 
                                                    sizes="40px" 
                                                    className="object-cover opacity-70" 
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[#d4c5b0] text-sm truncate font-serif">{item.amulet.nameEn || item.amulet.nameZh}</p>
                                                <p className="text-[10px] text-[#a39783] mt-0.5">{item.amulet.monkOrTemple} · {item.amulet.year}</p>
                                            </div>
                                            <div className="text-right shrink-0 font-mono text-xs text-[#a39783]">
                                                {item.quantity} × <span className="text-[#c4a265] whitespace-nowrap">${item.price.toFixed(2)}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="md:col-span-2">
                                <h4 className="text-[10px] text-[#8c8273] uppercase tracking-widest font-mono mb-3 border-b border-[#c4a265]/10 pb-1">Dispatch Protocol</h4>
                                <div className="bg-[#0a0908] rounded p-4 border border-[#c4a265]/5">
                                    <div className="flex items-start gap-2 text-[#a39783] text-sm mb-3">
                                        <MapPin className="w-4 h-4 text-[#c4a265] mt-1 shrink-0" />
                                        <p className="leading-relaxed">{order.snapAddress} <br /> Ph: {order.snapPhone}</p>
                                    </div>
                                    <div className="text-[10px] text-[#8c8273] font-mono border-t border-[#c4a265]/10 pt-2 mt-2 flex justify-between">
                                        <span>Sealed: {new Date(order.createdAt).toLocaleString()}</span>
                                        {order.trackingNumber && <span className="text-[#c4a265]">Tracing: {order.trackingProvider} {order.trackingNumber}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Side Drawer for Order Details */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedOrder(null)}>
                    <div
                        className="w-full max-w-xl h-full bg-[#0d0c0b] border-l border-[#c4a265]/30 flex flex-col shadow-2xl animate-in slide-in-from-right overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-[#c4a265]/20 flex justify-between items-center bg-[#1a1814]">
                            <div>
                                <h3 className="text-[#f5ebd7] font-serif text-xl font-bold">订单流水详情 (Order Receipt)</h3>
                                <p className="text-xs text-[#a39783] font-mono mt-1">ID: {selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-[#a39783] hover:text-[#f5ebd7] transition-colors bg-[#c4a265]/10 p-2 rounded">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="bg-[#1a1814] rounded-lg border border-[#c4a265]/10 p-4">
                                <h4 className="text-xs text-[#c4a265] uppercase tracking-widest font-mono mb-4 border-b border-[#c4a265]/10 pb-2 flex items-center gap-2">
                                    <UserIcon className="w-4 h-4" />
                                    客户快照 (Collector Details)
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-[#a39783] text-xs">Name</p>
                                        <p className="text-[#f5ebd7] font-medium">{selectedOrder.user?.name || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#a39783] text-xs">Email</p>
                                        <p className="text-[#f5ebd7] font-mono">{selectedOrder.user?.email || "N/A"}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[#a39783] text-xs">Shipping Address</p>
                                        <p className="text-[#f5ebd7] mt-1 p-3 bg-[#0a0908] rounded border border-[#c4a265]/10 leading-relaxed max-h-32 overflow-y-auto">{selectedOrder.snapAddress || "No address provided"}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[#a39783] text-xs">Phone</p>
                                        <p className="text-[#f5ebd7] mt-1 font-mono">{selectedOrder.snapPhone || "No phone provided"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#1a1814] rounded-lg border border-[#c4a265]/10 p-4">
                                <h4 className="text-xs text-[#c4a265] uppercase tracking-widest font-mono mb-4 border-b border-[#c4a265]/10 pb-2 flex items-center gap-2">
                                    <PackageCheck className="w-4 h-4" />
                                    圣物清单 (Holy Manifest)
                                </h4>
                                <ul className="space-y-4">
                                    {selectedOrder.items.map((item: any) => (
                                        <li key={item.id} className="flex items-center gap-4 bg-[#0a0908] p-3 rounded">
                                            <div className="relative w-16 h-20 shrink-0 border border-[#c4a265]/20 rounded overflow-hidden bg-[#0d0c0b]">
                                                <Image 
                                                    src={item.amulet.imageUrl || "/images/placeholder-amulet.png"} 
                                                    alt={item.amulet.nameEn || "Amulet"} 
                                                    fill 
                                                    sizes="64px" 
                                                    className="object-cover opacity-80" 
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[#d4c5b0] text-sm font-serif line-clamp-2">{item.amulet.nameZh}</p>
                                                <p className="text-[#a39783] text-xs mt-1">{item.amulet.nameEn}</p>
                                                <p className="text-[#a39783] text-[10px] mt-1">{item.amulet.monkOrTemple} · {item.amulet.year}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[#c4a265] text-sm font-bold font-mono">${item.price.toFixed(2)}</p>
                                                <p className="text-[#a39783] text-xs">x {item.quantity}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6 flex flex-col gap-4 border-t border-[#c4a265]/20 pt-4">
                                    <h4 className="text-xs text-[#c4a265] uppercase tracking-widest font-mono border-b border-[#c4a265]/10 pb-2">Order Modification</h4>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] text-[#a39783] uppercase tracking-widest font-mono mb-1">Total Adjustment ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editTotal}
                                                onChange={(e) => setEditTotal(e.target.value)}
                                                className="w-full bg-[#0a0908] border border-[#c4a265]/30 rounded px-3 py-2 text-sm text-[#f5ebd7] font-mono focus:outline-none focus:border-[#c4a265]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] text-[#a39783] uppercase tracking-widest font-mono mb-1">Carrier / Provider</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. FedEx, DHL, Thailand Post"
                                                value={editTrackingProvider}
                                                onChange={(e) => setEditTrackingProvider(e.target.value)}
                                                className="w-full bg-[#0a0908] border border-[#c4a265]/30 rounded px-3 py-2 text-sm text-[#f5ebd7] focus:outline-none focus:border-[#c4a265]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-[#a39783] uppercase tracking-widest font-mono mb-1">Tracking Number</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. TH123456789"
                                                value={editTrackingNumber}
                                                onChange={(e) => setEditTrackingNumber(e.target.value)}
                                                className="w-full bg-[#0a0908] border border-[#c4a265]/30 rounded px-3 py-2 text-sm text-[#f5ebd7] font-mono focus:outline-none focus:border-[#c4a265]"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-2">
                                        <button
                                            onClick={() => updateStatus(selectedOrder.id, selectedOrder.status)}
                                            className="hidden"
                                            id="hidden-update"
                                        />
                                        <button
                                            disabled={loading === selectedOrder.id}
                                            onClick={async () => {
                                                setLoading(selectedOrder.id);
                                                try {
                                                    const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
                                                        method: "PATCH",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({
                                                            total: editTotal,
                                                            trackingNumber: editTrackingNumber,
                                                            trackingProvider: editTrackingProvider
                                                        }),
                                                    });
                                                    if (res.ok) {
                                                        alert("Order details updated successfully.");
                                                        window.location.reload();
                                                    } else {
                                                        alert("Failed to update order details.");
                                                    }
                                                } catch (error) {
                                                    alert("Error updating order.");
                                                } finally {
                                                    setLoading(null);
                                                }
                                            }}
                                            className="px-6 py-2 bg-[#c4a265] text-[#0d0c0b] font-bold uppercase tracking-widest text-xs rounded hover:bg-[#d4c5b0] transition-colors disabled:opacity-50"
                                        >
                                            {loading === selectedOrder.id ? "Saving..." : "Save Modifications"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
