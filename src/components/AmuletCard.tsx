"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Amulet } from "@/types/amulet";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface AmuletCardProps {
  amulet: Amulet;
  index: number;
}

export const AmuletCard: FC<AmuletCardProps> = ({ amulet, index }) => {
  const { lang, t } = useLanguage();

  return (
    <Link
      href={`/amulet/${amulet.id}`}
      className="block h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c4a265] rounded-2xl"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group relative bg-[#1a1814]/80 backdrop-blur-md border border-[#c4a265]/20 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-[#c4a265]/60 hover:shadow-lg hover:shadow-[#c4a265]/20 flex flex-col h-full"
      >
        <div className="relative h-40 md:h-64 w-full bg-[#0a0908] overflow-hidden flex items-center justify-center shrink-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1814] via-transparent to-transparent z-10 pointer-events-none" />
          <img
            src={amulet.imageUrl}
            alt={lang === 'zh' ? (amulet.nameZh || "圣物") : (amulet.nameEn || amulet.nameZh || "Amulet")}
            className="object-cover w-full h-full opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 ease-in-out"
          />
        </div>

        <div className="relative z-20 p-6 -mt-8 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-1 md:mb-2">
            <h3 className="text-base md:text-xl font-bold text-[#f5ebd7] tracking-wider font-serif line-clamp-2 md:line-clamp-none leading-snug">
              {lang === "zh" ? (amulet.nameZh || "无名称") : (amulet.nameEn || amulet.nameZh || "No Name")}
            </h3>
            <span className="hidden md:inline-block px-3 py-1 bg-[#c4a265]/10 text-[#c4a265] text-xs rounded-full border border-[#c4a265]/20 whitespace-nowrap ml-2">
              {amulet.year}
            </span>
          </div>

          <p className="text-xs md:text-sm text-[#8c8273] font-medium mb-3 md:mb-6 italic truncate">
            {amulet.monkOrTemple}
          </p>

          <div className="space-y-2 md:space-y-3 flex-1 flex flex-col pt-1">
            <div className="flex justify-between items-center mb-2 md:mb-4">
              <span className="text-lg md:text-xl font-bold text-[#d5b57d]">
                ${(amulet.price || 0).toFixed(2)}
              </span>
              {amulet.stock > 0 ? (
                <span className="text-xs bg-green-900/30 text-green-400 border border-green-800/50 px-2 py-1 rounded">
                  {t(`剩 ${amulet.stock} 尊`, `${amulet.stock} in Stock`)}
                </span>
              ) : (
                <span className="text-xs bg-red-900/30 text-red-400 border border-red-800/50 px-2 py-1 rounded">
                  {t("售罄", "Sold Out")}
                </span>
              )}
            </div>

            <div className="hidden md:flex items-start text-sm">
              <span className="text-[#c4a265] w-20 shrink-0">
                {t("督造高僧", "Monk/Temple")}
              </span>
              <span className="text-[#d4c5b0]">{amulet.monkOrTemple}</span>
            </div>
            <div className="hidden md:flex items-start text-sm">
              <span className="text-[#c4a265] w-20 shrink-0">
                {t("核心材质", "Material")}
              </span>
              <span className="text-[#d4c5b0]">
                {lang === 'zh' ? (amulet.materialZh || "未知材质") : (amulet.materialEn || amulet.materialZh || "Unknown Material")}
              </span>
            </div>

            <div className="hidden md:block mt-auto pt-4 border-t border-[#c4a265]/10">
              <p className="text-xs text-[#a39783] leading-relaxed line-clamp-3">
                {lang === 'zh' ? (amulet.descZh || "暂无描述") : (amulet.descEn || amulet.descZh || "No Description available")}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-tr from-[#c4a265]/0 via-[#c4a265]/5 to-[#c4a265]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </motion.div>
    </Link>
  );
};
