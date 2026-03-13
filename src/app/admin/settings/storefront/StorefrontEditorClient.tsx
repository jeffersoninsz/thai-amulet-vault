"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Save, Image as ImageIcon } from "lucide-react";

interface HeroConfig {
    titleZh: string;
    titleEn: string;
    subtitleZh: string;
    subtitleEn: string;
    heroBannerUrl: string;
}

export default function StorefrontEditorClient({ initialHero }: { initialHero: HeroConfig }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [hero, setHero] = useState<HeroConfig>(initialHero);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setHero(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("heroConfig", JSON.stringify(hero));

            const res = await fetch(`/api/admin/settings/site`, {
                method: "POST", // We can use the existing site config endpoint or create a new patch logic
                body: formData
            });

            if (!res.ok) throw new Error("Failed to save Storefront config");

            toast.success("Storefront Updated Successfully!");
            router.refresh();
        } catch (error) {
            toast.error("Error saving data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#1a1814] rounded-xl p-6 md:p-8 border border-[#c4a265]/20 shadow-2xl">
            <h3 className="text-xl font-serif text-[#c4a265] mb-6">首页 Hero 大图块 (Homepage Hero Banner)</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Left Side: Inputs */}
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-[#c4a265] mb-2 uppercase tracking-wide">
                            主标题 (Main Title)
                        </label>
                        <div className="space-y-3">
                            <input
                                type="text" name="titleZh" value={hero.titleZh} onChange={handleChange}
                                placeholder="中文标题" className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded-lg px-4 py-3 text-[#f5ebd7] focus:outline-none focus:border-[#c4a265]"
                            />
                            <input
                                type="text" name="titleEn" value={hero.titleEn} onChange={handleChange}
                                placeholder="English Title" className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded-lg px-4 py-3 text-[#f5ebd7] focus:outline-none focus:border-[#c4a265]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#c4a265] mb-2 uppercase tracking-wide">
                            副标题 (Subtitle)
                        </label>
                        <div className="space-y-3">
                            <textarea
                                name="subtitleZh" value={hero.subtitleZh} onChange={handleChange} rows={2}
                                placeholder="中文副标" className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded-lg px-4 py-3 text-[#f5ebd7] focus:outline-none focus:border-[#c4a265] resize-none"
                            />
                            <textarea
                                name="subtitleEn" value={hero.subtitleEn} onChange={handleChange} rows={2}
                                placeholder="English Subtitle" className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded-lg px-4 py-3 text-[#f5ebd7] focus:outline-none focus:border-[#c4a265] resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side: Media & Preview */}
                <div className="space-y-5 flex flex-col">
                    <div>
                        <label className="block text-sm font-medium text-[#c4a265] mb-2 uppercase tracking-wide flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            首屏背景图 (Background Image URL)
                        </label>
                        <input
                            type="text" name="heroBannerUrl" value={hero.heroBannerUrl} onChange={handleChange}
                            placeholder="/images/your-banner.jpg" className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded-lg px-4 py-3 text-[#f5ebd7] focus:outline-none focus:border-[#c4a265] font-mono text-sm"
                        />
                    </div>

                    {/* Mini live preview skeleton */}
                    <div className="relative flex-1 mt-4 rounded-xl border border-[#c4a265]/30 overflow-hidden bg-black/50 min-h-[200px] flex flex-col justify-center items-center text-center p-6 grayscale-[30%]">
                        {hero.heroBannerUrl && (
                            <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: `url(${hero.heroBannerUrl})` }} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                        <div className="relative z-10">
                            <h4 className="text-2xl font-serif text-[#f5ebd7] drop-shadow-lg">{hero.titleZh || "Titles preview"}</h4>
                            <p className="text-xs text-[#a39783] mt-2 max-w-sm">{hero.subtitleZh || "Subtitle preview"}</p>
                        </div>
                    </div>
                </div>

            </div>

            <div className="mt-8 pt-6 border-t border-[#c4a265]/20 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#c4a265] text-[#0a0908] px-8 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-[#d4c5b0] transition-colors disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    {loading ? "Saving..." : "Save Storefront"}
                </button>
            </div>
        </div>
    );
}
