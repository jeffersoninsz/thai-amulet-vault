"use client";

import { useState } from "react";
import { Settings2, Plus, Edit2, ShieldCheck } from "lucide-react";

export function CasingConfigurator() {
    const [casings, setCasings] = useState([
        { id: "c1", name: "22K Gold Waterproof", material: "Gold", additionalPrice: 350, leadTimeDays: 7, isActive: true },
        { id: "c2", name: "925 Silver Enamel", material: "Silver", additionalPrice: 120, leadTimeDays: 5, isActive: true },
        { id: "c3", name: "Premium Acrylic", material: "Acrylic", additionalPrice: 20, leadTimeDays: 2, isActive: true },
    ]);

    return (
        <div className="bg-[#1a1814] border border-[#c4a265]/20 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#c4a265]/10 rounded border border-[#c4a265]/30">
                        <Settings2 className="w-5 h-5 text-[#c4a265]" />
                    </div>
                    <h3 className="text-[#f5ebd7] text-xl font-serif tracking-widest uppercase">高定包壳与配件矩阵 (Casing Matrix)</h3>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#c4a265]/10 text-[#c4a265] border border-[#c4a265]/30 rounded hover:bg-[#c4a265] hover:text-[#0d0c0b] transition-colors text-sm font-bold">
                    <Plus className="w-4 h-4" /> ADD CASING
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#c4a265]/20 text-[#a39783] text-xs uppercase tracking-widest font-mono">
                            <th className="py-3 px-4">Casing Profile</th>
                            <th className="py-3 px-4">Material Base</th>
                            <th className="py-3 px-4">Premium (USD)</th>
                            <th className="py-3 px-4">Lead Time</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#c4a265]/10">
                        {casings.map(casing => (
                            <tr key={casing.id} className="hover:bg-[#c4a265]/5 transition-colors">
                                <td className="py-4 px-4 text-[#f5ebd7] font-semibold text-sm flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-[#c4a265]" />
                                    {casing.name}
                                </td>
                                <td className="py-4 px-4 text-[#d4c5b0] text-sm">{casing.material}</td>
                                <td className="py-4 px-4 text-[#c4a265] font-mono">+${casing.additionalPrice.toFixed(2)}</td>
                                <td className="py-4 px-4 text-[#a39783] text-sm">{casing.leadTimeDays} Days</td>
                                <td className="py-4 px-4">
                                    <span className={`px-2 py-1 text-[10px] uppercase tracking-widest font-mono rounded border ${casing.isActive ? 'bg-green-900/20 text-green-500 border-green-500/30' : 'bg-red-900/20 text-red-500 border-red-500/30'}`}>
                                        {casing.isActive ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <button className="text-[#a39783] hover:text-[#c4a265] transition-colors">
                                        <Edit2 className="w-4 h-4 inline" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 p-4 bg-[#0a0908] rounded border border-dashed border-[#c4a265]/30">
                <p className="text-xs text-[#a39783] leading-relaxed">
                    <strong className="text-[#c4a265]">Architecture Note:</strong> Casing premiums selected by customers will be structurally injected into the Stripe Checkout session under <code className="bg-[#1a1814] px-1 rounded text-[#d4c5b0]">order.snapCasing</code> as a JSON payload, safeguarding mathematical atomicity.
                </p>
            </div>
        </div>
    );
}
