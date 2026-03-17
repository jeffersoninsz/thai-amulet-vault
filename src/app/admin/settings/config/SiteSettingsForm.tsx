"use client";

import { useState } from "react";
import { PenTool, Save, Globe, Info } from "lucide-react";

export function SiteSettingsForm({ config }: { config: any }) {
    const [formData, setFormData] = useState({
        heroTitleZh: config?.heroTitleZh || "",
        heroTitleEn: config?.heroTitleEn || "",
        heroDescZh: config?.heroDescZh || "",
        heroDescEn: config?.heroDescEn || "",
        announcementBarEn: config?.announcementBarEn || "",
        isStripeEnabled: config?.isStripeEnabled ?? true,
        isOfferEnabled: config?.isOfferEnabled ?? true,
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
                        <div className="flex items-center gap-3 p-4 bg-[#0a0908]/50 rounded-lg border border-[#c4a265]/20">
                            <Info className="w-5 h-5 text-[#c4a265] shrink-0" />
                            <div>
                                <p className="text-[#f5ebd7] text-sm font-medium">流量模拟引擎已迁移</p>
                                <p className="text-[#a39783] text-xs mt-1">访客计数器 {'&'} 虚假订单弹窗的配置已统一至 <a href="/admin/settings/marketing" className="text-[#c4a265] underline hover:text-[#d4c5b0] transition-colors font-medium">CRO营销 (Marketing)</a> 页面管理。</p>
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
