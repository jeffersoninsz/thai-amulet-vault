"use client";

import { Amulet } from "@/types/amulet";
import {
  ArrowLeft,
  Sparkles,
  Shield,
  Bookmark,
  User,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { CommentsList } from "@/components/CommentsList";
import { InstagramCarousel } from "@/components/InstagramCarousel";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from "next/image";

import { useRouter } from "next/navigation";

export default function AmuletDetailClient({ amulet, userRole, adminComments }: { amulet: Amulet, userRole?: string, adminComments?: any[] }) {
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();
  const router = useRouter();

  // Create an array of up to 5 images, using the primary image as the first, and duplicating or adding placeholders for demo purposes 
  // since the db schema currently only holds one main imageUrl per Amulet. In production, this would use amulet.images[]
  const amuletImages = [
    amulet.imageUrl,
    amulet.imageUrl.replace('.webp', '-2.webp').replace('.png', '-2.png'), // simulated 2nd image
    amulet.imageUrl.replace('.webp', '-3.webp').replace('.png', '-3.png'), // simulated 3rd image
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-[#0d0c0b] text-[#d4c5b0] pb-24">
      <TopNav />

      <div className="max-w-7xl mx-auto px-6 pt-28 md:pt-32 lg:pt-40 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
        <div className="relative mt-8 md:mt-0 lg:sticky lg:top-32 group rounded-2xl overflow-hidden border border-[#c4a265]/20 shadow-2xl shadow-[#c4a265]/10 bg-[#1a1814]">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0d0c0b] via-transparent to-transparent z-10 pointer-events-none"></div>

          <Swiper
            pagination={{ type: 'fraction' }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="w-full h-full amulet-swiper"
          >
            {amuletImages.map((img, idx) => (
              <SwiperSlide key={idx} className="bg-[#1a1814] flex items-center justify-center relative min-h-[400px] md:min-h-[600px]">
                <Image
                  src={img || "/images/placeholder-amulet.png"}
                  alt={lang === "zh" ? `${amulet.nameZh} / 细节图 ${idx + 1}` : `${amulet.nameEn} / Detail ${idx + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain md:object-cover aspect-square md:aspect-auto hover:scale-105 transition-transform duration-[1.5s] ease-out"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <div className="bg-[#0d0c0b]/70 backdrop-blur border border-[#c4a265]/30 text-[#c4a265] px-4 py-1.5 rounded-full text-[10px] md:text-xs tracking-widest font-mono">
              {amulet.id.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-1000">
          <header className="space-y-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-[#a39783] hover:text-[#c4a265] transition-colors group mb-4"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="tracking-widest text-sm">
                {t("返回上页", "Go Back")}
              </span>
            </button>

            <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-[#f5ebd7] tracking-wider leading-tight">
              {lang === "zh" ? (amulet.nameZh || "无名称") : (amulet.nameEn || amulet.nameZh || "No Name")}
            </h1>
            <h2 className="text-2xl text-[#8c8273] font-serif italic mb-6">
              {amulet.monkOrTemple}
            </h2>

            <div className="flex items-center justify-between border-y border-[#c4a265]/20 py-6 my-6">
              <div>
                <div className="text-sm text-[#a39783] mb-1">
                  {t("尊享结缘价", "Exclusive Price")}
                </div>
                <div className="text-4xl font-bold text-[#d5b57d] font-serif">
                  ${(amulet.price || 0).toFixed(2)}
                </div>
              </div>
              <div>
                {amulet.stock > 0 ? (
                  <button
                    onClick={() => addToCart(amulet)}
                    className="flex items-center gap-2 px-8 py-3 bg-[#c4a265] text-[#0d0c0b] font-bold rounded hover:bg-[#d5b57d] transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {t(`加入收藏柜 (仅剩 ${amulet.stock} 尊)`, `Add to Cart (${amulet.stock} left)`)}
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-8 py-3 bg-red-900/30 text-red-500 font-bold rounded cursor-not-allowed border border-red-900/50"
                  >
                    {t("已被恭请 (售罄)", "Sold Out")}
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1814] border border-[#c4a265]/20 rounded-lg text-sm text-[#c4a265]">
                <Sparkles className="w-4 h-4" /> {t("督造年份:", "Year:")}{" "}
                {amulet.year}
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1814] border border-[#c4a265]/20 rounded-lg text-sm text-[#c4a265]">
                <Shield className="w-4 h-4" /> {t("核心材质:", "Material:")}{" "}
                {lang === "zh" ? (amulet.materialZh || "未知材质") : (amulet.materialEn || amulet.materialZh || "Unknown Material")}
              </span>
            </div>
          </header>

          <section className="space-y-6 border-t border-[#c4a265]/10 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-[#c4a265]" />
              <h3 className="text-2xl font-serif text-[#f5ebd7]">
                {t("神脉传承", "Monk / Temple")}
              </h3>
            </div>
            <p className="text-lg text-[#d4c5b0] leading-relaxed bg-[#1a1814]/50 p-6 rounded-xl border-l-[3px] border-[#c4a265]">
              {amulet.monkOrTemple}
            </p>
          </section>

          <section className="space-y-6 pt-4">
            <div className="flex items-center gap-3 mb-4">
              <Bookmark className="w-6 h-6 text-[#c4a265]" />
              <h3 className="text-2xl font-serif text-[#f5ebd7]">
                {t("文化与历史考究", "Cultural & Historical Context")}
              </h3>
            </div>
            <div className="prose prose-invert prose-p:text-[#a39783] prose-p:leading-loose max-w-none break-words">
              <p>{lang === "zh" ? (amulet.descZh || "暂无描述") : (amulet.descEn || amulet.descZh || "No Description available")}</p>
              <p className="mt-4 text-xs">
                <em>
                  {t(
                    "根据公司资料库收录卷宗记载，该圣品在东南亚佛教文化中具有独特地位，结合了当时的社会历史背景与该法脉极其严苛的加持开光仪式。",
                    "According to our vault records, this artifact holds a unique position in Southeast Asian Buddhist culture, combining historical significance with rigorous consecration rituals.",
                  )}
                </em>
              </p>
            </div>
          </section>

          <CommentsList amuletId={amulet.id} comments={amulet.comments || []} userRole={userRole} />
        </div>
      </div>
      {adminComments && adminComments.length > 0 && (
        <div className="mt-24">
          <InstagramCarousel comments={adminComments} />
        </div>
      )}

      {/* 5. Mobile Bottom Action Bar (Stick to bottom on small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0a0908]/95 backdrop-blur-3xl border-t border-[#c4a265]/20 p-4 z-50 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.8)] pb-safe">
        <div className="flex flex-col">
          <span className="text-xs text-[#a39783] uppercase tracking-widest">{t("结缘价", "Price")}</span>
          <span className="text-2xl font-bold text-[#d5b57d] font-serif">${(amulet.price || 0).toFixed(2)}</span>
        </div>

        {amulet.stock > 0 ? (
          <button
            onClick={() => addToCart(amulet)}
            className="flex items-center gap-2 px-6 py-3 bg-[#c4a265] text-[#0d0c0b] font-bold text-sm uppercase rounded shadow-[0_0_20px_rgba(196,162,101,0.3)] hover:bg-[#d5b57d] active:scale-95 transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            <div className="flex flex-col text-left">
              <span>{t("加入收藏柜", "Add to Cart")}</span>
              <span className="text-[10px] opacity-80 font-normal normal-case -mt-1">{t(`剩余 ${amulet.stock} 尊`, `${amulet.stock} in stock`)}</span>
            </div>
          </button>
        ) : (
          <button
            disabled
            className="px-6 py-3 bg-red-900/30 text-red-500 font-bold text-sm uppercase rounded cursor-not-allowed border border-red-900/50"
          >
            {t("已售罄", "Sold Out")}
          </button>
        )}
      </div>
    </main>
  );
}
