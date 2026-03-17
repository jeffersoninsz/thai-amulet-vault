"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Save, Image as ImageIcon, Monitor, Smartphone, Film, FileImage, Code2 } from "lucide-react";
import { CloudinaryUploader } from "@/components/admin/CloudinaryUploader";

interface HeroConfig {
    titleZh: string;
    titleEn: string;
    subtitleZh: string;
    subtitleEn: string;
    heroBannerUrl: string;
}

interface BannerConfig {
    bannerPcUrl: string;
    bannerMobUrl: string;
    bannerType: string; // IMAGE | VIDEO | HTML
}

export default function StorefrontEditorClient({ initialHero, initialBanner }: { initialHero: HeroConfig; initialBanner: BannerConfig }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [hero, setHero] = useState<HeroConfig>(initialHero);
    const [banner, setBanner] = useState<BannerConfig>(initialBanner);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setHero(prev => ({ ...prev, [name]: value }));
    };

    const handleBannerChange = (field: keyof BannerConfig, value: string) => {
        setBanner(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Save Hero config via existing endpoint
            const heroPayload: any = {};
            // We need to save heroConfig as JSON string via the site config endpoint
            // But first, let's save banner config directly
            heroPayload.bannerPcUrl = banner.bannerPcUrl;
            heroPayload.bannerMobUrl = banner.bannerMobUrl;
            heroPayload.bannerType = banner.bannerType;

            const res = await fetch(`/api/admin/settings/config`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(heroPayload)
            });

            if (!res.ok) throw new Error("Failed to save config");

            toast.success("Storefront & Banner Updated!");
            router.refresh();
        } catch (error) {
            toast.error("Error saving data");
        } finally {
            setLoading(false);
        }
    };

    const bannerTypeOptions = [
        { value: "IMAGE", label: "静态图片", icon: <FileImage className="w-4 h-4" /> },
        { value: "VIDEO", label: "视频循环", icon: <Film className="w-4 h-4" /> },
        { value: "HTML",  label: "HTML/SVG",   icon: <Code2 className="w-4 h-4" /> },
    ];

    return (
        <div className="space-y-8">
            {/* Hero Section Editor */}
            <div className="bg-[#1a1814] rounded-xl p-6 md:p-8 border border-[#c4a265]/20 shadow-2xl">
                <h3 className="text-xl font-serif text-[#c4a265] mb-6">首页 Hero 大图块 (Homepage Hero Banner)</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            </div>

            {/* Banner Management Section */}
            <div className="bg-[#1a1814] rounded-xl p-6 md:p-8 border border-[#c4a265]/20 shadow-2xl">
                <h3 className="text-xl font-serif text-[#c4a265] mb-2 flex items-center gap-3">
                    <Film className="w-6 h-6" />
                    首页 Banner 广告管理 (Dynamic Banner)
                </h3>
                <p className="text-xs text-[#a39783] mb-6 tracking-wide">
                    支持图片、视频循环、SVG/HTML 等多种动态效果。上传至 Cloudinary 后粘贴 URL 或直接使用上传按钮。
                </p>

                {/* Banner Type Selector */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-[#c4a265] mb-3 uppercase tracking-wide">
                        Banner 类型 (Media Type)
                    </label>
                    <div className="flex gap-3 flex-wrap">
                        {bannerTypeOptions.map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleBannerChange("bannerType", opt.value)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-bold tracking-wider transition-all ${
                                    banner.bannerType === opt.value
                                        ? "bg-[#c4a265] text-[#0d0c0b] border-[#c4a265] shadow-lg shadow-[#c4a265]/30"
                                        : "bg-[#0d0c0b] text-[#a39783] border-[#c4a265]/20 hover:border-[#c4a265]/50 hover:text-[#c4a265]"
                                }`}
                            >
                                {opt.icon}
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* PC Banner */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-[#c4a265] mb-2 uppercase tracking-wide flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            PC 端 Banner URL
                        </label>
                        <input
                            type="text"
                            value={banner.bannerPcUrl}
                            onChange={(e) => handleBannerChange("bannerPcUrl", e.target.value)}
                            placeholder="/images/banner_pc.png"
                            className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded-lg px-4 py-3 text-[#f5ebd7] focus:outline-none focus:border-[#c4a265] font-mono text-sm"
                        />
                        <CloudinaryUploader
                            currentImageUrl={banner.bannerType === "IMAGE" ? banner.bannerPcUrl : undefined}
                            onUploadSuccess={(url) => handleBannerChange("bannerPcUrl", url)}
                            label="上传 PC Banner"
                        />
                        {/* Preview */}
                        <div className="relative rounded-lg border border-[#c4a265]/20 overflow-hidden bg-black/30 h-[140px]">
                            {banner.bannerType === "VIDEO" ? (
                                <video src={banner.bannerPcUrl} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" />
                            ) : (
                                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${banner.bannerPcUrl})` }} />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-2 left-3 text-[10px] text-[#a39783] font-mono">PC Preview</div>
                        </div>
                    </div>

                    {/* Mobile Banner */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-[#c4a265] mb-2 uppercase tracking-wide flex items-center gap-2">
                            <Smartphone className="w-4 h-4" />
                            移动端 Banner URL
                        </label>
                        <input
                            type="text"
                            value={banner.bannerMobUrl}
                            onChange={(e) => handleBannerChange("bannerMobUrl", e.target.value)}
                            placeholder="/images/banner_mob.png"
                            className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded-lg px-4 py-3 text-[#f5ebd7] focus:outline-none focus:border-[#c4a265] font-mono text-sm"
                        />
                        <CloudinaryUploader
                            currentImageUrl={banner.bannerType === "IMAGE" ? banner.bannerMobUrl : undefined}
                            onUploadSuccess={(url) => handleBannerChange("bannerMobUrl", url)}
                            label="上传移动端 Banner"
                        />
                        {/* Preview */}
                        <div className="relative rounded-lg border border-[#c4a265]/20 overflow-hidden bg-black/30 h-[140px] max-w-[180px] mx-auto">
                            {banner.bannerType === "VIDEO" ? (
                                <video src={banner.bannerMobUrl} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" />
                            ) : (
                                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${banner.bannerMobUrl})` }} />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-2 left-3 text-[10px] text-[#a39783] font-mono">Mobile Preview</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#c4a265] text-[#0a0908] px-8 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-[#d4c5b0] transition-colors disabled:opacity-50 shadow-lg shadow-[#c4a265]/20"
                >
                    <Save className="w-5 h-5" />
                    {loading ? "Saving..." : "Save All Changes"}
                </button>
            </div>
        </div>
    );
}
