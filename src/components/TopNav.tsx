'use client';

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { ShoppingCart, Search, User, Heart, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Amulet } from "@/types/amulet";
import { useSession, signOut } from "next-auth/react";

export function TopNav() {
  const { data: session } = useSession();
  const isWholesale = session?.user?.role === "WHOLESALE" || session?.user?.role === "ADMIN";
  const { lang, setLang, t } = useLanguage();
  const { items } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { items: navItems } = useNavigation();
  const mainNav = navItems.filter(i => i.group === 'HEADER_MAIN');
  const megaCategory = navItems.filter(i => i.group === 'HEADER_MEGA_CATEGORY');
  const megaMaster = navItems.filter(i => i.group === 'HEADER_MEGA_MASTER');
  const megaEffect = navItems.filter(i => i.group === 'HEADER_MEGA_EFFECT');
  const miniJournal = navItems.filter(i => i.group === 'HEADER_MINI_JOURNAL');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = items.reduce((acc, current) => acc + current.quantity, 0);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${scrolled || searchOpen
          ? "bg-[#0d0c0b] border-b border-[#c4a265]/20 shadow-xl py-2 lg:py-3"
          : "bg-[#0d0c0b]/95 backdrop-blur-3xl pt-3 pb-2 lg:pt-4 lg:pb-3 border-b border-[#c4a265]/5"
          }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* LEFT: Branding */}
          <Link href="/" className="group flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-normal sm:tracking-[0.15em] text-[#c4a265] uppercase transition-colors group-hover:text-[#f5ebd7] drop-shadow-lg whitespace-nowrap">
              SIAM<span className="text-[#f5ebd7] transition-colors group-hover:text-[#c4a265]">TREASURES</span>
            </span>
          </Link>

          {/* CENTER: Desktop Mega Nav Links */}
          <div className="hidden lg:flex items-center justify-center gap-8 xl:gap-14 text-base tracking-[0.15em] uppercase font-bold text-[#a39783]">
            <Link href="/" className="hover:text-[#c4a265] transition-colors whitespace-nowrap">{t("首页", "Home")}</Link>

            {mainNav.map(nav => (
              <Link key={nav.id} href={nav.href} className="hover:text-[#c4a265] transition-colors whitespace-nowrap">
                {lang === "zh" ? nav.labelZh : nav.labelEn}
              </Link>
            ))}

            <div className="relative group py-2">
              <Link href="/collections" className="flex items-center gap-1 hover:text-[#c4a265] transition-colors cursor-pointer whitespace-nowrap">
                {t("圣物殿堂", "Collections")} <ChevronDown className="w-4 h-4" />
              </Link>
              {/* Mega Dropdown */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] bg-[#0d0c0b]/95 backdrop-blur-xl border border-[#c4a265]/20 shadow-[-5px_15px_30px_rgba(0,0,0,0.6)] rounded-sm p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-4 group-hover:translate-y-0 flex gap-8 z-50">
                <div className="flex-1">
                  <h4 className="text-[#f5ebd7] font-serif mb-4 border-b border-[#c4a265]/20 pb-2 whitespace-nowrap">{t("法相与类型", "Categories")}</h4>
                  <ul className="space-y-3 text-sm text-[#8c8273]">
                    {megaCategory.length > 0 ? megaCategory.map(nav => (
                      <li key={nav.id}><Link href={nav.href} className="hover:text-[#c4a265] whitespace-nowrap">{lang === "zh" ? nav.labelZh : nav.labelEn}</Link></li>
                    )) : (
                      // Fallback
                      <>
                        <li><Link href="/collections?category=somdej" className="hover:text-[#c4a265] whitespace-nowrap">{t("崇迪佛 (Somdej)", "Somdej")}</Link></li>
                        <li><Link href="/collections?category=pidta" className="hover:text-[#c4a265] whitespace-nowrap">{t("必打佛 (Pidta)", "Pidta")}</Link></li>
                        <li><Link href="/collections?category=khunphaen" className="hover:text-[#c4a265] whitespace-nowrap">{t("坤平佛 (Khun Phaen)", "Khun Phaen")}</Link></li>
                        <li><Link href="/collections?category=phrom" className="hover:text-[#c4a265] whitespace-nowrap">{t("四面神 (Phra Phrom)", "Phra Phrom")}</Link></li>
                        <li><Link href="/collections?category=kruangrang" className="hover:text-[#c4a265] whitespace-nowrap">{t("冠兰圣物 (Kruang Rang)", "Kruang Rang")}</Link></li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="flex-1">
                  <h4 className="text-[#f5ebd7] font-serif mb-4 border-b border-[#c4a265]/20 pb-2 whitespace-nowrap">{t("名师法脉", "Masters Lineage")}</h4>
                  <ul className="space-y-3 text-sm text-[#8c8273]">
                    {megaMaster.length > 0 ? megaMaster.map(nav => (
                      <li key={nav.id}><Link href={nav.href} className="hover:text-[#c4a265] whitespace-nowrap">{lang === "zh" ? nav.labelZh : nav.labelEn}</Link></li>
                    )) : (
                      <>
                        <li><Link href="/collections?monk=toh" className="hover:text-[#c4a265] whitespace-nowrap">{t("阿赞多派系 (Arjan Toh)", "Arjan Toh Lineage")}</Link></li>
                        <li><Link href="/collections?monk=koon" className="hover:text-[#c4a265] whitespace-nowrap">{t("龙婆坤 (LP Koon)", "LP Koon")}</Link></li>
                        <li><Link href="/collections?monk=tim" className="hover:text-[#c4a265] whitespace-nowrap">{t("龙婆添 (LP Tim)", "LP Tim")}</Link></li>
                        <li><Link href="/collections?monk=parn" className="hover:text-[#c4a265] whitespace-nowrap">{t("龙婆班 (LP Parn)", "LP Parn")}</Link></li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="flex-1">
                  <h4 className="text-[#f5ebd7] font-serif mb-4 border-b border-[#c4a265]/20 pb-2 whitespace-nowrap">{t("神圣功效", "Sacred Effects")}</h4>
                  <ul className="space-y-3 text-sm text-[#8c8273]">
                    {megaEffect.length > 0 ? megaEffect.map(nav => (
                      <li key={nav.id}><Link href={nav.href} className="hover:text-[#c4a265] whitespace-nowrap">{lang === "zh" ? nav.labelZh : nav.labelEn}</Link></li>
                    )) : (
                      <>
                        <li><Link href="/collections?effect=wealth" className="hover:text-[#c4a265] whitespace-nowrap">{t("招财致富 (Wealth)", "Wealth & Luck")}</Link></li>
                        <li><Link href="/collections?effect=protection" className="hover:text-[#c4a265] whitespace-nowrap">{t("挡灾避险 (Protection)", "Protection")}</Link></li>
                        <li><Link href="/collections?effect=charm" className="hover:text-[#c4a265] whitespace-nowrap">{t("极佳人缘 (Charm & Metta)", "Charm & Metta")}</Link></li>
                        <li><Link href="/collections?effect=health" className="hover:text-[#c4a265] whitespace-nowrap">{t("健康平安 (Health)", "Health")}</Link></li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="relative group py-2">
              <Link href="/story" className="flex items-center gap-1 hover:text-[#c4a265] transition-colors cursor-pointer whitespace-nowrap">
                {t("灵感溯源", "Journal")} <ChevronDown className="w-4 h-4" />
              </Link>
              {/* Mini Dropdown */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 bg-[#0d0c0b] border border-[#c4a265]/20 shadow-[-5px_15px_30px_rgba(0,0,0,0.6)] rounded-sm py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                {miniJournal.length > 0 ? miniJournal.map(nav => (
                  <Link key={nav.id} href={nav.href} className="block px-6 py-2 hover:bg-[#c4a265]/10 hover:text-[#c4a265] whitespace-nowrap">{lang === "zh" ? nav.labelZh : nav.labelEn}</Link>
                )) : (
                  <>
                    <Link href="/story" className="block px-6 py-2 hover:bg-[#c4a265]/10 hover:text-[#c4a265] whitespace-nowrap">{t("精神源起", "Brand Story")}</Link>
                    <Link href="/blog" className="block px-6 py-2 hover:bg-[#c4a265]/10 hover:text-[#c4a265] whitespace-nowrap">{t("智慧文献", "Articles & Faith")}</Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: User Action Hub (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <button
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}
              className="text-[10px] font-bold font-mono px-2 py-1 border border-[#c4a265]/40 rounded hover:bg-[#c4a265]/10 text-[#f5ebd7] hover:text-[#c4a265] transition-all"
            >
              {lang === "zh" ? "EN" : "ZH"}
            </button>

            {isWholesale && (
              <Link href="/quick-order" className="text-[#d4c5b0] hover:text-[#c4a265] transition-colors flex items-center gap-1 font-sans text-xs tracking-widest uppercase ml-2 border border-[#c4a265]/30 px-3 py-1 rounded-full bg-[#c4a265]/5">
                ⚡ {t("极速下单", "Quick Order")}
              </Link>
            )}

            <button onClick={() => setSearchOpen(!searchOpen)} className="text-[#d4c5b0] hover:text-[#c4a265] transition-colors"><Search className="w-6 h-6" /></button>
            <div className="relative group p-2 mx-[-8px]">
              <div className="flex items-center gap-1 cursor-pointer">
                <Link href={(session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "ADMIN" || session?.user?.role === "STAFF") ? "/admin" : "/account"} className="text-[#d4c5b0] hover:text-[#c4a265] transition-colors"><User className="w-6 h-6" /></Link>
              </div>
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 bg-[#0d0c0b] border border-[#c4a265]/20 shadow-[-5px_15px_30px_rgba(0,0,0,0.6)] rounded-sm py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                {session ? (
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left block px-6 py-2 hover:bg-[#c4a265]/10 hover:text-[#c4a265] whitespace-nowrap">{t("安全退出", "Sign Out")}</button>
                ) : (
                  <Link href="/auth/signin" className="block px-6 py-2 hover:bg-[#c4a265]/10 hover:text-[#c4a265] whitespace-nowrap">{t("注册 / 登录", "Sign In / Register")}</Link>
                )}
              </div>
            </div>
            <Link href="/account/wishlist" className="text-[#d4c5b0] hover:text-[#c4a265] transition-colors"><Heart className="w-6 h-6" /></Link>

            <Link
              href="/cart"
              className="relative text-[#d4c5b0] hover:text-[#c4a265] transition-colors flex items-center"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#c4a265] text-[#0d0c0b] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0d0c0b]">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* MOBILE: Action Hub */}
          <div className="flex items-center gap-4 lg:hidden flex-shrink-0">
            {isWholesale && (
              <Link href="/quick-order" className="text-[#c4a265] leading-none" title={t("极速下单", "Quick Order")}>
                ⚡
              </Link>
            )}
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-[#d4c5b0] hover:text-[#c4a265] transition-colors">
              <Search className="w-6 h-6" />
            </button>
            <Link href="/cart" className="relative text-[#d4c5b0] hover:text-[#c4a265] transition-colors flex items-center">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#c4a265] text-[#0d0c0b] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0d0c0b]">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="text-[#d4c5b0] pl-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>

        {/* Global Search Overlay Header Expansion */}
        {searchOpen && (
          <div className="absolute top-full left-0 w-full bg-[#1a1814] border-b border-[#c4a265]/20 p-6 shadow-xl animate-in fade-in z-50">
            <div className="max-w-2xl mx-auto relative flex items-center gap-4">
              <Search className="w-6 h-6 text-[#c4a265]" />
              <input
                type="text"
                placeholder={t("输入关键词，比如 '崇迪' 或年份...", "Search for amulets, monks, temples...")}
                className="w-full bg-transparent text-xl font-serif text-[#f5ebd7] outline-none placeholder:text-[#a39783]"
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="text-[#a39783] hover:text-white uppercase tracking-widest text-xs">{t("关闭", "Close")}</button>
            </div>
          </div>
        )}
      </nav >

      {/* Mobile Menu Overlay */}
      < div
        className={`fixed inset-0 bg-[#0d0c0b]/95 z-40 lg:hidden transition-transform duration-300 backdrop-blur-xl overflow-y-auto ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`
        }
      >
        <div className="flex flex-col min-h-full py-24 items-center space-y-8 text-xl font-serif text-[#d4c5b0] px-8">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c4a265] tracking-widest uppercase">{t("首页", "Home")}</Link>
          <Link href="/collections" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c4a265] tracking-widest uppercase">{t("所有收藏", "Collections")}</Link>
          <Link href="/story" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c4a265] tracking-widest uppercase">{t("品牌精神", "Brand Story")}</Link>
          <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c4a265] tracking-widest uppercase">{t("灵感博客", "Journal")}</Link>
          <div className="h-px w-24 bg-[#c4a265]/30 my-4"></div>
          <Link href={(session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "ADMIN" || session?.user?.role === "STAFF") ? "/admin" : "/account"} onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c4a265] tracking-widest uppercase text-sm flex items-center gap-2"><User className="w-4 h-4" /> {t("我的账户", "Account")}</Link>
          <Link href="/account/wishlist" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c4a265] tracking-widest uppercase text-sm flex items-center gap-2"><Heart className="w-4 h-4" /> {t("心愿单", "Wishlist")}</Link>

          <button
            onClick={() => {
              setLang(lang === "zh" ? "en" : "zh");
              setMobileMenuOpen(false);
            }}
            className="mt-8 px-6 py-2 border border-[#c4a265]/50 text-[#c4a265] rounded-full text-sm font-sans"
          >
            {t("切换至", "Switch to")} {lang === "zh" ? "English" : "中文"}
          </button>
        </div>
      </div >
    </>
  );
}
