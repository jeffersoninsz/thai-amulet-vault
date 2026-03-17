"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Save, BellRing, Eye, Zap } from "lucide-react";

export interface MarketingConfigPayload {
    fakeSalesEnabled: boolean;
    popupIntervalMin: number;
    popupIntervalMax: number;
    fakeSalesCities: string;
    fakeSalesNames: string;
    fakeViewsEnabled: boolean;
    baseViews: number;
    viewIncreaseRate: number;
    visitorTickInterval: number;
}

export default function MarketingEditorClient({ initialConfig }: { initialConfig: Partial<MarketingConfigPayload> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Marketing Config State
    const [form, setForm] = useState<MarketingConfigPayload>({
        fakeSalesEnabled: initialConfig.fakeSalesEnabled ?? false,
        popupIntervalMin: initialConfig.popupIntervalMin ?? 30,
        popupIntervalMax: initialConfig.popupIntervalMax ?? 90,
        fakeSalesCities: initialConfig.fakeSalesCities ?? "北京,上海,广州,深圳,成都,杭州,香港,台北,新加坡,吉隆坡,纽约,多伦多",
        fakeSalesNames: initialConfig.fakeSalesNames ?? "王先生,陈女士,李先生,张女士,刘先生,吴女士,郑先生,黄女士,Jefferson,Alex,Linda",
        fakeViewsEnabled: initialConfig.fakeViewsEnabled ?? false,
        baseViews: initialConfig.baseViews ?? 120,
        viewIncreaseRate: initialConfig.viewIncreaseRate ?? 3,
        visitorTickInterval: initialConfig.visitorTickInterval ?? 12
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name.includes('Interval') || name.includes('Rate') || name.includes('Views')) ? Number(value) : value
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/settings/marketing`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (!res.ok) throw new Error("Failed to save Marketing config");

            toast.success("Marketing Triggers Updated!");
            router.refresh();
        } catch (error) {
            toast.error("Error saving data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#1a1814] rounded-xl p-6 md:p-8 border border-[#c4a265]/20 shadow-2xl space-y-12">

            {/* Fake Sales Popups */}
            <div className="space-y-6 pb-8 border-b border-[#c4a265]/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#c4a265]/10 rounded border border-[#c4a265]/30">
                        <BellRing className="w-6 h-6 text-[#c4a265]" />
                    </div>
                    <div>
                        <h3 className="text-xl font-serif text-[#f5ebd7]">Recent Sales Popups (FOMO Trigger)</h3>
                        <p className="text-[#a39783] text-sm">Simulates real-time purchases from randomized global buyers.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-[3.25rem]">
                    <label className="flex items-center gap-4 cursor-pointer group">
                        <div className={`w-6 h-6 flex items-center justify-center border rounded transition-colors
                            ${form.fakeSalesEnabled ? "bg-[#c4a265] border-[#c4a265]" : "bg-black/50 border-[#a39783]/40 group-hover:border-[#c4a265]/50"}
                        `}>
                            {form.fakeSalesEnabled && <div className="w-3 h-3 bg-black rounded-sm" />}
                        </div>
                        <span className={`font-medium ${form.fakeSalesEnabled ? "text-[#f5ebd7]" : "text-[#a39783]"}`}>
                            Enable Fake Sales Popups
                        </span>
                        <input
                            type="checkbox" name="fakeSalesEnabled"
                            checked={form.fakeSalesEnabled} onChange={handleChange}
                            className="hidden"
                        />
                    </label>

                    {form.fakeSalesEnabled && (
                        <div className="space-y-4 animate-in fade-in">
                            <div>
                                <label className="block text-sm text-[#c4a265] mb-2 uppercase">Min Interval (Seconds)</label>
                                <input type="number" name="popupIntervalMin" value={form.popupIntervalMin} onChange={handleChange}
                                    className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded-lg px-4 py-2 text-[#f5ebd7] focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm text-[#c4a265] mb-2 uppercase">Max Interval (Seconds)</label>
                                <input type="number" name="popupIntervalMax" value={form.popupIntervalMax} onChange={handleChange}
                                    className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded-lg px-4 py-2 text-[#f5ebd7] focus:outline-none" />
                            </div>

                            <div className="col-span-1 md:col-span-2 pt-2 border-t border-[#c4a265]/10">
                                <label className="block text-sm text-[#c4a265] mb-2 uppercase">Custom Buyer Names (Comma Separated)</label>
                                <textarea name="fakeSalesNames" value={form.fakeSalesNames || ""} onChange={handleChange}
                                    className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded-lg px-4 py-2 text-[#f5ebd7] focus:outline-none" rows={2} />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm text-[#c4a265] mb-2 uppercase">Custom Destined Cities (Comma Separated)</label>
                                <textarea name="fakeSalesCities" value={form.fakeSalesCities || ""} onChange={handleChange}
                                    className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded-lg px-4 py-2 text-[#f5ebd7] focus:outline-none" rows={2} />
                            </div>

                        </div>
                    )}
                </div>
            </div>

            {/* Fake Web Viewers */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#c4a265]/10 rounded border border-[#c4a265]/30">
                        <Eye className="w-6 h-6 text-[#c4a265]" />
                    </div>
                    <div>
                        <h3 className="text-xl font-serif text-[#f5ebd7]">Active Viewers Counter (Social Proof)</h3>
                        <p className="text-[#a39783] text-sm">Simulates heavy traffic and high concurrent shoppers on product pages.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-[3.25rem]">
                    <label className="flex items-center gap-4 cursor-pointer group">
                        <div className={`w-6 h-6 flex items-center justify-center border rounded transition-colors
                            ${form.fakeViewsEnabled ? "bg-[#c4a265] border-[#c4a265]" : "bg-black/50 border-[#a39783]/40 group-hover:border-[#c4a265]/50"}
                        `}>
                            {form.fakeViewsEnabled && <div className="w-3 h-3 bg-black rounded-sm" />}
                        </div>
                        <span className={`font-medium ${form.fakeViewsEnabled ? "text-[#f5ebd7]" : "text-[#a39783]"}`}>
                            Enable Simulated Viewers
                        </span>
                        <input
                            type="checkbox" name="fakeViewsEnabled"
                            checked={form.fakeViewsEnabled} onChange={handleChange}
                            className="hidden"
                        />
                    </label>

                    {form.fakeViewsEnabled && (
                        <div className="space-y-4 animate-in fade-in">
                            <div>
                                <label className="block text-sm text-[#c4a265] mb-2 uppercase">Base Baseline Viewers</label>
                                <input type="number" name="baseViews" value={form.baseViews} onChange={handleChange}
                                    className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded-lg px-4 py-2 text-[#f5ebd7] focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm text-[#c4a265] mb-2 uppercase">Incremental Rate (Per tick offset)</label>
                                <input type="number" name="viewIncreaseRate" value={form.viewIncreaseRate} onChange={handleChange}
                                    className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded-lg px-4 py-2 text-[#f5ebd7] focus:outline-none" />
                            </div>
                            <div className="col-span-1 md:col-span-2 pt-2 border-t border-[#c4a265]/10">
                                <label className="block text-sm text-[#c4a265] mb-2 uppercase">Tick Speed Interval (Seconds per jump)</label>
                                <input type="number" name="visitorTickInterval" value={form.visitorTickInterval} onChange={handleChange}
                                    className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded-lg px-4 py-2 text-[#f5ebd7] focus:outline-none" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#c4a265]/20 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#c4a265] text-[#0a0908] px-8 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-[#d4c5b0] transition-colors disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    {loading ? "Saving..." : "Deploy Config"}
                </button>
            </div>
        </div>
    );
}
