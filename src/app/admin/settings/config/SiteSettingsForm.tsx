"use client";

import { useState } from "react";
import { PenTool, Save, Globe, Info } from "lucide-react";

export function SiteSettingsForm({ config }: { config: any }) {
    const [formData, setFormData] = useState({
        heroTitleZh: config?.heroTitleZh || "",
        heroTitleEn: config?.heroTitleEn || "",
        heroDescZh: config?.heroDescZh || "",
        heroDescEn: config?.heroDescEn || "",
        baseVisitorCount: config?.baseVisitorCount || 1250,
        announcementBarEn: config?.announcementBarEn || "",
        isVisitorCounterEnabled: config?.isVisitorCounterEnabled ?? true,
        visitorIncrementRate: config?.visitorIncrementRate || 5,
        isSalesPopupEnabled: config?.isSalesPopupEnabled ?? true,
        salesPopupFrequency: config?.salesPopupFrequency || 15,
        isStripeEnabled: config?.isStripeEnabled ?? true,
        isOfferEnabled: config?.isOfferEnabled ?? true,
        visitorJumpInterval: config?.visitorJumpInterval || 12,
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage("");

        try {
            const res = await fetch("/api/admin/settings/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setMessage("Settings successfully saved and live.");
                alert("修改成功！系统已进行全局部署。 (Settings modified successfully!)");
                window.location.reload();
            } else {
                setMessage("Error saving configuration.");
            }
        } catch (error) {
            setMessage("Error saving configuration.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {message && (
                <div className="p-4 bg-green-900/20 border border-green-500/50 text-green-400 rounded flex items-center justify-between">
                    <span className="font-mono text-sm tracking-wide">{message}</span>
                </div>
            )}

            {/* HERO SECTION MODULE */}
            <div className="bg-[#1a1814] border border-[#c4a265]/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6 border-b border-[#c4a265]/20 pb-4">
                    <Globe className="w-5 h-5 text-[#c4a265]" />
                    <h3 className="text-[#f5ebd7] font-serif text-xl tracking-widest uppercase">Hero Banner Content</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[#a39783] text-xs font-mono uppercase mb-2">Chinese Title</label>
                            <input name="heroTitleZh" value={formData.heroTitleZh} onChange={handleChange} className="w-full bg-[#0a0908] border border-[#c4a265]/30 rounded p-3 text-[#f5ebd7] focus:border-[#c4a265] focus:outline-none transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[#a39783] text-xs font-mono uppercase mb-2">Chinese Description</label>
                            <textarea name="heroDescZh" value={formData.heroDescZh} onChange={handleChange} className="w-full bg-[#0a0908] border border-[#c4a265]/30 rounded p-3 text-[#f5ebd7] focus:border-[#c4a265] focus:outline-none transition-colors h-24" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[#a39783] text-xs font-mono uppercase mb-2">English Title</label>
                            <input name="heroTitleEn" value={formData.heroTitleEn} onChange={handleChange} className="w-full bg-[#0a0908] border border-[#c4a265]/30 rounded p-3 text-[#f5ebd7] focus:border-[#c4a265] focus:outline-none transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[#a39783] text-xs font-mono uppercase mb-2">English Description</label>
                            <textarea name="heroDescEn" value={formData.heroDescEn} onChange={handleChange} className="w-full bg-[#0a0908] border border-[#c4a265]/30 rounded p-3 text-[#f5ebd7] focus:border-[#c4a265] focus:outline-none transition-colors h-24" />
                        </div>
                    </div>
                </div>
            </div>

            {/* MARKETING TRIGGERS */}
            <div className="bg-[#1a1814] border border-[#c4a265]/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6 border-b border-[#c4a265]/20 pb-4">
                    <PenTool className="w-5 h-5 text-[#c4a265]" />
                    <h3 className="text-[#f5ebd7] font-serif text-xl tracking-widest uppercase">Marketing Options</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Form layout shifted */}
                    <div>
                        <label className="block text-[#a39783] text-xs font-mono uppercase mb-2">Enable Private Offers</label>
                        <label className="inline-flex relative items-center cursor-pointer mt-2">
                            <input type="checkbox" name="isOfferEnabled" checked={formData.isOfferEnabled} onChange={handleChange} className="sr-only peer" />
                            <div className="w-14 h-7 bg-[#0a0908] border border-[#c4a265]/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#c4a265] after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#c4a265]/20"></div>
                            <span className="ml-3 text-sm font-bold text-[#d4c5b0] uppercase tracking-wider">{formData.isOfferEnabled ? "ACTIVE" : "HIDDEN"}</span>
                        </label>
                    </div>

                    <div className="md:col-span-2 border-t border-[#c4a265]/10 mt-4 pt-6">
                        <h4 className="text-[#f5ebd7] font-serif text-lg tracking-widest uppercase mb-6">Traffic Simulation Engines</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-[#0a0908]/50 p-4 rounded-lg border border-[#c4a265]/20">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-[#c4a265] text-xs font-mono uppercase font-bold">1. Visitor Eye Counter</label>
                                    <label className="inline-flex relative items-center cursor-pointer">
                                        <input type="checkbox" name="isVisitorCounterEnabled" checked={formData.isVisitorCounterEnabled} onChange={handleChange} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-[#1a1814] border border-[#c4a265]/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#c4a265] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c4a265]/20"></div>
                                    </label>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[#a39783] text-[10px] font-mono uppercase mb-2">Maximum Jump per interval</label>
                                        <input type="number" name="visitorIncrementRate" value={formData.visitorIncrementRate} onChange={handleChange} className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded p-2 text-[#f5ebd7] font-mono text-sm focus:border-[#c4a265] focus:outline-none" min="1" max="100" />
                                    </div>
                                    <div>
                                        <label className="block text-[#a39783] text-[10px] font-mono uppercase mb-2">Jump Interval (Seconds)</label>
                                        <input type="number" name="visitorJumpInterval" value={formData.visitorJumpInterval} onChange={handleChange} className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded p-2 text-[#f5ebd7] font-mono text-sm focus:border-[#c4a265] focus:outline-none" min="1" max="60" />
                                    </div>
                                    <div>
                                        <label className="block text-[#a39783] text-[10px] font-mono uppercase mb-2">Base Initial Count</label>
                                        <input type="number" name="baseVisitorCount" value={formData.baseVisitorCount} onChange={handleChange} className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded p-2 text-[#f5ebd7] font-mono text-sm focus:border-[#c4a265] focus:outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#0a0908]/50 p-4 rounded-lg border border-[#c4a265]/20">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-[#c4a265] text-xs font-mono uppercase font-bold">2. Recent Sales Toaster</label>
                                    <label className="inline-flex relative items-center cursor-pointer">
                                        <input type="checkbox" name="isSalesPopupEnabled" checked={formData.isSalesPopupEnabled} onChange={handleChange} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-[#1a1814] border border-[#c4a265]/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#c4a265] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c4a265]/20"></div>
                                    </label>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[#a39783] text-[10px] font-mono uppercase mb-2">Display Frequency (Seconds)</label>
                                        <input type="number" name="salesPopupFrequency" value={formData.salesPopupFrequency} onChange={handleChange} className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded p-2 text-[#f5ebd7] font-mono text-sm focus:border-[#c4a265] focus:outline-none" min="5" max="300" />
                                    </div>
                                    <p className="text-[10px] text-[#8c8273] italic">Lower frequency means the popup fires more often, creating artificial FOMO.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button type="submit" disabled={isSaving} className="bg-[#c4a265] text-[#0a0908] px-8 py-4 rounded font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#d4c5b0] transition shadow-[0_0_20px_rgba(196,162,101,0.2)] disabled:opacity-50">
                    <Save className="w-5 h-5" />
                    {isSaving ? "Synchronizing..." : "Deploy Configuration"}
                </button>
            </div>
        </form>
    );
}
