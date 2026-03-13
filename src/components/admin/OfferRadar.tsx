"use client";

import { useState, useEffect } from "react";
import { Radar, Bell, Check, X, Link as LinkIcon } from "lucide-react";

export function OfferRadar() {
    const [offers, setOffers] = useState<any[]>([]);

    useEffect(() => {
        // In a real scenario, this would use WebSockets or useSWR polling
        // To simulate the 'radar' effect, we mock initial data that could have been fetched from API
        const mockOffers = [
            { id: "1", username: "Collector_Wong", amuletName: "Phra Somdej Wat Rakang", offerPrice: 12000, status: "PENDING", time: "2 mins ago" },
            { id: "2", username: "David_US", amuletName: "LP Koon 2536", offerPrice: 500, status: "PENDING", time: "15 mins ago" }
        ];
        setOffers(mockOffers);
    }, []);

    return (
        <div className="bg-[#1a1814] border border-[#c4a265]/20 rounded-xl p-6 shadow-2xl relative overflow-hidden">
            {/* Background Radar Effect */}
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <div className="w-64 h-64 border border-[#c4a265] rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
                    <div className="w-1/2 h-full bg-gradient-to-r from-transparent to-[#c4a265]/50 origin-bottom rounded-tr-full"></div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#c4a265]/20 rounded text-[#c4a265] animate-pulse">
                        <Radar className="w-6 h-6" />
                    </div>
                    <h3 className="text-[#f5ebd7] text-xl font-serif tracking-widest uppercase">藏家结缘雷达 (Offer Radar)</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c4a265] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#c4a265]"></span>
                    </span>
                    <span className="text-[#c4a265] text-xs font-mono">LIVE</span>
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                {offers.length === 0 ? (
                    <div className="text-center py-8 text-[#8c8273] font-mono text-sm border border-dashed border-[#8c8273]/30 rounded">
                        No incoming offers. Scanning the vault perimeter...
                    </div>
                ) : (
                    offers.map(offer => (
                        <div key={offer.id} className="bg-[#0a0908] border border-[#c4a265]/30 rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-[#c4a265] hover:shadow-[0_0_15px_rgba(196,162,101,0.2)]">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[#d4c5b0] font-bold text-sm">{offer.username}</span>
                                    <span className="text-[#8c8273] text-xs font-mono">{offer.time}</span>
                                </div>
                                <p className="text-[#a39783] text-sm">Requested: <span className="text-[#f5ebd7] font-serif">{offer.amuletName}</span></p>
                                <p className="text-[#c4a265] font-mono mt-1 text-lg">${offer.offerPrice.toLocaleString()}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2 bg-green-900/40 text-green-500 border border-green-500/50 rounded hover:bg-green-500 hover:text-[#0a0908] transition-colors flex items-center gap-2 text-xs font-bold tracking-wider">
                                    <Check className="w-4 h-4" /> ACCEPT & LINK
                                </button>
                                <button className="p-2 bg-red-900/40 text-red-500 border border-red-500/50 rounded hover:bg-red-500 hover:text-[#0a0908] transition-colors flex items-center gap-2 text-xs font-bold tracking-wider">
                                    <X className="w-4 h-4" /> REJECT
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
