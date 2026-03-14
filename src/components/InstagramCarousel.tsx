"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { MessageSquareQuote } from "lucide-react";
import Image from "next/image";

// The comment interface from Prisma
interface AdminComment {
    id: string;
    content: string;
    images: string;
    author: string;
    amulet: {
        id: string;
        nameZh: string;
        nameEn: string;
        imageUrl: string;
    };
}

export function InstagramCarousel({ comments }: { comments: AdminComment[] }) {
    const { lang, t } = useLanguage();

    if (!comments || comments.length === 0) return null;

    return (
        <div className="w-full py-16 bg-[#0a0908] border-t border-[#c4a265]/10">
            <div className="max-w-[1600px] mx-auto px-6 mb-8 text-center">
                <h2 className="text-2xl font-serif text-[#f5ebd7] uppercase tracking-widest flex items-center justify-center gap-3">
                    <MessageSquareQuote className="w-6 h-6 text-[#c4a265]" />
                    {t("金库管理员评鉴", "Vault Curator Reviews")}
                </h2>
                <p className="text-[#a39783] text-sm mt-2 font-serif italic">
                    {t("滑动查看内部审核的真实品相与评价", "Swipe to see authentic curator insights")}
                </p>
            </div>

            <div className="w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 px-6 md:px-12 flex gap-4 md:gap-6 justify-start scroll-smooth">
                {comments.map((comment) => {
                    let imgs = [];
                    try {
                        imgs = JSON.parse(comment.images || "[]");
                    } catch (e) { }
                    const imgUrl = imgs.length > 0 ? imgs[0] : comment.amulet.imageUrl;

                    return (
                        <Link
                            href={`/amulet/${comment.amulet.id}`}
                            key={comment.id}
                            className="group relative shrink-0 snap-center w-[280px] h-[280px] md:w-[320px] md:h-[320px] cursor-pointer rounded-xl overflow-hidden shadow-xl"
                        >
                            {/* Fallback pattern if no image */}
                            <div className="absolute inset-0 bg-[#1a1814] flex items-center justify-center">
                                <Image 
                                    src={imgUrl || "/images/placeholder-amulet.png"} 
                                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                                    alt="Review" 
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>

                            {/* Overlay (Visible on Hover for Desktop, always slightly visible or tap to view on mobile) */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0b]/90 via-[#0d0c0b]/50 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                                <div className="translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 transition-transform duration-300">
                                    <p className="text-[#c4a265] text-xs font-mono font-bold mb-1 line-clamp-1">
                                        {lang === 'zh' ? comment.amulet.nameZh : comment.amulet.nameEn}
                                    </p>
                                    <p className="text-[#f5ebd7] text-sm leading-relaxed line-clamp-3 font-serif">
                                        "{comment.content}"
                                    </p>
                                    <div className="text-[10px] text-[#a39783] mt-3 uppercase tracking-wider">
                                        — {comment.author}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
        </div>
    );
}
