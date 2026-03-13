"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { useSiteConfig } from "@/contexts/SiteConfigContext";

export function Footer() {
    const { lang, t } = useLanguage();
    const { items: navItems } = useNavigation();
    const { config } = useSiteConfig();

    const footerNav = navItems.filter(i => i.group === 'FOOTER_NAV');
    const footerLegal = navItems.filter(i => i.group === 'FOOTER_LEGAL');
    return (
        <footer className="bg-[#0d0c0b] text-[#8c8273] py-16 border-t border-[#c4a265]/20 font-sans px-6 mt-auto">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">

                <div className="col-span-1 md:col-span-2">
                    <h3 className="text-xl md:text-2xl font-serif text-[#c4a265] uppercase tracking-widest mb-4 md:mb-6">SiamTreasures</h3>
                    <p className="max-w-sm mb-6 leading-relaxed italic border-l border-[#c4a265]/50 pl-4 text-xs md:text-sm font-serif">
                        {lang === "zh"
                            ? (config?.footerTextZh || t("秉持文化传承，所有圣物均经过严苛的宗教开光与真品历史审查，提供绝对的纯粹与保障。", "Dedicated to cultural heritage."))
                            : (config?.footerTextEn || "Dedicated to cultural heritage. All items have undergone rigorous religious consecration and historical authentication, providing absolute purity and assurance.")}
                    </p>
                </div>

                <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-[#f5ebd7] font-bold uppercase tracking-wider mb-4 text-xs md:text-sm border-b border-[#c4a265]/10 pb-2">{t("导航菜单", "Navigation")}</h4>
                        <ul className="space-y-3 text-xs md:text-sm">
                            {footerNav.length > 0 ? footerNav.map(nav => (
                                <li key={nav.id}><Link href={nav.href} className="hover:text-[#c4a265] transition-colors">{lang === "zh" ? nav.labelZh : nav.labelEn}</Link></li>
                            )) : (
                                <>
                                    <li><Link href="/collections" className="hover:text-[#c4a265] transition-colors">{t("藏品馆", "Collections")}</Link></li>
                                    <li><Link href="/story" className="hover:text-[#c4a265] transition-colors">{t("品牌精神", "The Story")}</Link></li>
                                    <li><Link href="/blog" className="hover:text-[#c4a265] transition-colors">{t("灵感日志", "Journal")}</Link></li>
                                    <li><Link href="/account" className="hover:text-[#c4a265] transition-colors">{t("私人账户", "User Account")}</Link></li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[#f5ebd7] font-bold uppercase tracking-wider mb-4 text-xs md:text-sm border-b border-[#c4a265]/10 pb-2">{t("法律条款", "Legal")}</h4>
                        <ul className="space-y-3 text-xs md:text-sm">
                            {footerLegal.length > 0 ? footerLegal.map(nav => (
                                <li key={nav.id}><Link href={nav.href} className="hover:text-[#c4a265] transition-colors">{lang === "zh" ? nav.labelZh : nav.labelEn}</Link></li>
                            )) : (
                                <>
                                    <li><a href="#" className="hover:text-[#c4a265] transition-colors">{t("隐私条款", "Privacy Policy")}</a></li>
                                    <li><a href="#" className="hover:text-[#c4a265] transition-colors">{t("全球物流", "Shipping & Duty")}</a></li>
                                    <li><a href="#" className="hover:text-[#c4a265] transition-colors">{t("退换声明", "Return Policy")}</a></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto mt-16 pt-8 border-t border-[#c4a265]/10 text-xs flex flex-col md:flex-row justify-between items-center text-center">
                <p>&copy; {config?.copyrightYear || new Date().getFullYear()} SiamTreasures. {t("保留所有权利。", "All Rights Reserved.")}</p>
                <p className="mt-4 md:mt-0 font-mono tracking-widest text-[#a39783]/50">{config?.systemVersionText || t("安全保管库系统", "SECURE VAULT SYSTEM v2.0")}</p>
            </div>
        </footer>
    );
}
