"use client";

import { useState, useMemo } from "react";
import { Amulet } from "@/types/amulet";
import { AmuletCard } from "@/components/AmuletCard";
import { Search, Filter, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function AmuletShowcase({
  initialAmulets,
}: {
  initialAmulets: Amulet[];
}) {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMonks, setSelectedMonks] = useState<string[]>([]);
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // Get unique materials for filter
  const materials = useMemo(() => {
    const mats = new Set(initialAmulets.map((a) => a.materialZh).filter(Boolean));
    return Array.from(mats);
  }, [initialAmulets]);

  const toggleFilter = (setState: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    setState((prev) => prev.includes(val) ? prev.filter((m) => m !== val) : [...prev, val]);
  };

  const displayAmulets = useMemo(() => {
    return initialAmulets.filter((a) => {
      const dbText = (a.nameZh + " " + a.descZh + " " + (a.monkOrTemple || "")).toLowerCase();

      const matchesSearch = search === "" || dbText.includes(search.toLowerCase()) || a.nameEn.toLowerCase().includes(search.toLowerCase());
      const matchesMaterial = selectedMaterials.length === 0 || selectedMaterials.includes(a.materialZh);

      // Category map
      const catMap: Record<string, string[]> = {
        'somdej': ['崇迪', 'somdej'], 'pidta': ['必打', '掩面', 'pidta'], 'khunphaen': ['坤平', 'khun'], 'phrom': ['四面', '四面神', 'phrom'], 'kruangrang': ['冠兰', '灭魔', '路翁', '塔固', '符', 'kruang']
      };
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(cat => catMap[cat]?.some(keyword => dbText.includes(keyword)));

      // Monk map
      const monkMap: Record<string, string[]> = {
        'toh': ['阿赞多', '多', '拉康', 'rakang', 'toh'], 'koon': ['坤', 'koon'], 'tim': ['添', 'tim', 'laharnyai'], 'parn': ['班', 'parn', 'bang nom kho']
      };
      const matchesMonk = selectedMonks.length === 0 || selectedMonks.some(m => monkMap[m]?.some(keyword => dbText.includes(keyword)));

      // Effect map
      const effectMap: Record<string, string[]> = {
        'wealth': ['财', '富', '生', 'wealth', 'money', 'business'], 'protection': ['险', '灾', '保', '安', 'protect', 'safe'], 'charm': ['缘', '魅', '桃花', '人见', 'charm', 'metta'], 'health': ['健', '康', '药', 'health', 'heal']
      };
      const matchesEffect = selectedEffects.length === 0 || selectedEffects.some(eff => effectMap[eff]?.some(keyword => dbText.includes(keyword)));

      return matchesSearch && matchesMaterial && matchesCategory && matchesMonk && matchesEffect;
    });
  }, [initialAmulets, search, selectedMaterials, selectedCategories, selectedMonks, selectedEffects]);

  // Handle resetting visible count when filters change
  useMemo(() => {
    setVisibleCount(12);
  }, [search, selectedMaterials, selectedCategories, selectedMonks, selectedEffects]);

  const displayedSlice = displayAmulets.slice(0, visibleCount);

  return (
    <section className="max-w-[1600px] mx-auto px-6 py-12 relative z-10 w-full mb-20 bg-[#0d0c0b]">
      {/* Mobile Filter Toggle Button (Sticky) */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="px-6 py-3 bg-[#c4a265] text-[#0d0c0b] rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(196,162,101,0.4)]"
        >
          <Filter className="w-4 h-4" />
          {t("筛选圣物", "Filter Artifacts")}
          {(selectedMaterials.length + selectedCategories.length + selectedMonks.length + selectedEffects.length) > 0 && (
            <span className="w-5 h-5 bg-[#0d0c0b] text-[#c4a265] rounded-full flex items-center justify-center text-[10px] ml-1">
              {selectedMaterials.length + selectedCategories.length + selectedMonks.length + selectedEffects.length}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Desktop Filter Sidebar / Mobile Filter Drawer Wrapper */}
        <div className={`fixed lg:relative inset-0 z-[100] lg:z-auto transition-transform duration-300 lg:translate-x-0 ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:w-72 lg:flex-shrink-0'}`}>
          {/* Mobile Overlay */}
          <div onClick={() => setIsMobileFilterOpen(false)} className={`absolute inset-0 bg-black/80 lg:hidden ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0'} transition-opacity`} />

          <div className="bg-[#1a1814] w-[85vw] max-w-sm lg:w-full h-full lg:h-auto overflow-y-auto p-5 md:p-6 lg:rounded-2xl lg:border border-[#c4a265]/20 shadow-xl relative z-10">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 text-[#f5ebd7] font-serif">
                <Filter className="w-5 h-5 text-[#c4a265]" />
                <h2 className="text-xl font-bold">{t("精细筛选", "Filters")}</h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="lg:hidden p-2 text-[#a39783] hover:text-[#f5ebd7] transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="relative w-full mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39783]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("搜索名称、高僧...", "Search name, monk...")}
                  className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded-full py-2 pl-10 pr-4 text-[#d4c5b0] text-sm focus:ring-1 focus:ring-[#c4a265] outline-none placeholder:text-[#a39783]/50"
                />
              </div>
            </div>

            <div className="space-y-4">
              {/* Filter Section Builder Function */}
              {[
                {
                  label: t("法相类型", "Category"), state: selectedCategories, setter: setSelectedCategories, options: [
                    { id: 'somdej', name: t('崇迪', 'Somdej') }, { id: 'pidta', name: t('必打', 'Pidta') }, { id: 'khunphaen', name: t('坤平', 'Khun Phaen') }, { id: 'phrom', name: t('四面神', 'Phra Phrom') }, { id: 'kruangrang', name: t('冠兰', 'Kruang Rang') }
                  ]
                },
                {
                  label: t("名师法脉", "Monk"), state: selectedMonks, setter: setSelectedMonks, options: [
                    { id: 'toh', name: t('阿赞多系', 'Arjan Toh') }, { id: 'koon', name: t('龙婆坤', 'LP Koon') }, { id: 'tim', name: t('龙婆添', 'LP Tim') }, { id: 'parn', name: t('龙婆班', 'LP Parn') }
                  ]
                },
                {
                  label: t("神圣功效", "Effect"), state: selectedEffects, setter: setSelectedEffects, options: [
                    { id: 'wealth', name: t('招财致富', 'Wealth') }, { id: 'protection', name: t('挡灾避险', 'Protection') }, { id: 'charm', name: t('极佳人缘', 'Charm') }, { id: 'health', name: t('健康平安', 'Health') }
                  ]
                },
                { label: t("核心材质", "Material"), state: selectedMaterials, setter: setSelectedMaterials, options: materials.map(m => ({ id: m, name: m })) }
              ].map((section, idx) => (
                <div key={idx} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 border-b border-[#c4a265]/10 pb-4 last:border-0 last:pb-0">
                  <span className="text-[#a39783] text-xs uppercase tracking-wider font-mono font-semibold shrink-0 md:w-20 pl-1 md:pl-0">
                    {section.label}
                  </span>
                  <div className="flex flex-nowrap md:flex-wrap overflow-x-auto gap-2 pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {section.options.map((opt) => {
                      const isSelected = section.state.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          onClick={() => toggleFilter(section.setter, opt.id)}
                          className={`shrink-0 px-3 py-1 md:px-6 md:py-2 rounded-full text-[11px] md:text-sm transition-all border ${isSelected ? 'bg-[#c4a265] text-[#0d0c0b] border-[#c4a265] font-bold shadow-[0_0_15px_rgba(196,162,101,0.4)]' : 'bg-[#0a0908] text-[#a39783] border-[#c4a265]/30 hover:border-[#c4a265]/70 hover:text-[#f5ebd7]'}`}
                        >
                          {opt.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Apply Button */}
            <div className="mt-8 lg:hidden pb-12">
              <button onClick={() => setIsMobileFilterOpen(false)} className="w-full bg-[#c4a265] text-[#0d0c0b] py-3 rounded uppercase font-bold tracking-widest">
                {t("查看结果", `Show ${displayAmulets.length} Results`)}
              </button>
            </div>
          </div>
        </div>

        {/* Main Product Grid */}
        <div className="flex-1 w-full relative z-0">
          <div className="mb-6 flex justify-between items-end border-b border-[#c4a265]/10 pb-4">
            <h2 className="text-xl md:text-2xl font-serif text-[#f5ebd7]">
              {search || selectedMaterials.length > 0
                ? t("筛选结果", "Filtered Results")
                : t("臻品典藏", "Premium Collection")}
            </h2>
            <span className="text-[#a39783] text-sm tracking-widest">
              {displayAmulets.length} {t("件已收录", "recorded items")}
            </span>
          </div>

          {displayAmulets.length === 0 ? (
            <div className="py-20 text-center text-[#a39783] border border-dashed border-[#c4a265]/20 rounded-2xl bg-[#1a1814]/30">
              {t(
                "库中暂无符合条件的圣物档案。",
                "No records match your criteria in the vault.",
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 auto-rows-fr">
                {displayedSlice.map((amulet, idx) => (
                  <AmuletCard
                    key={amulet.id}
                    amulet={amulet}
                    index={idx > 12 ? 1 : idx}
                  />
                ))}
              </div>

              {visibleCount < displayAmulets.length && (
                <div className="mt-16 flex justify-center">
                  <button
                    onClick={() => setVisibleCount(v => v + 12)}
                    className="px-12 py-4 border border-[#c4a265]/50 text-[#c4a265] bg-[#1a1814] hover:bg-[#c4a265] hover:text-[#0d0c0b] font-bold uppercase tracking-widest text-sm rounded transition-all shadow-lg"
                  >
                    {t("加载更多圣物", "Load More Artifacts")}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
