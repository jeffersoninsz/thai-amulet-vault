'use client';

import { useState, useEffect } from 'react';
import { Amulet } from '@/types/amulet';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from "next/image";

const CITIES_ZH = ['北京', '上海', '广州', '深圳', '成都', '杭州', '香港', '台北', '新加坡', '吉隆坡', '纽约', '多伦多'];
const CITIES_EN = ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou', 'Hong Kong', 'Taipei', 'Singapore', 'Kuala Lumpur', 'New York', 'Toronto'];
const NAMES_ZH = ['王先生', '陈女士', '李先生', '张女士', '刘先生', '吴女士', '郑先生', '黄女士', 'Jefferson', 'Alex', 'Linda'];
const NAMES_EN = ['Mr. Wang', 'Ms. Chen', 'Mr. Li', 'Ms. Zhang', 'Mr. Liu', 'Ms. Wu', 'Mr. Zheng', 'Ms. Huang', 'Jefferson', 'Alex', 'Linda'];

export function FakeOrderToast({
    amulets,
    enabled,
    minInterval = 30,
    maxInterval = 90,
    customCities,
    customNames
}: {
    amulets: Pick<Amulet, 'nameZh' | 'nameEn' | 'imageUrl'>[],
    enabled: boolean,
    minInterval?: number,
    maxInterval?: number,
    customCities?: string,
    customNames?: string
}) {
    const { lang, t } = useLanguage();
    const [toast, setToast] = useState<{ id: number, nameZh: string, nameEn: string, cityZh: string, cityEn: string, amuletNameZh: string, amuletNameEn: string, amuletImg: string, time: number } | null>(null);

    useEffect(() => {
        if (!enabled || amulets.length === 0) return;

        let timeoutId: NodeJS.Timeout;

        const scheduleNextToast = () => {
            // Random interval using dynamic config (in ms)
            const delay = Math.floor(Math.random() * (maxInterval - minInterval + 1) * 1000) + (minInterval * 1000);
            timeoutId = setTimeout(() => {
                showToast();
                scheduleNextToast();
            }, delay);
        };

        const showToast = () => {
            const citiesZh = customCities ? customCities.split(',').map(s => s.trim()) : CITIES_ZH;
            const citiesEn = customCities ? customCities.split(',').map(s => s.trim()) : CITIES_EN;
            const namesZh = customNames ? customNames.split(',').map(s => s.trim()) : NAMES_ZH;
            const namesEn = customNames ? customNames.split(',').map(s => s.trim()) : NAMES_EN;

            const randomIndex = Math.floor(Math.random() * citiesZh.length);
            const randomNameIndex = Math.floor(Math.random() * namesZh.length);
            const randomCityZh = citiesZh[randomIndex] || CITIES_ZH[0];
            const randomCityEn = citiesEn[randomIndex] || CITIES_EN[0];
            const randomNameZh = namesZh[randomNameIndex] || NAMES_ZH[0];
            const randomNameEn = namesEn[randomNameIndex] || NAMES_EN[0];

            const randomAmulet = amulets[Math.floor(Math.random() * amulets.length)];
            const randomTime = Math.floor(Math.random() * 15) + 1; // 1-15 mins ago

            setToast({
                id: Date.now(),
                nameZh: randomNameZh,
                nameEn: randomNameEn,
                cityZh: randomCityZh,
                cityEn: randomCityEn,
                amuletNameZh: randomAmulet.nameZh || randomAmulet.nameEn,
                amuletNameEn: randomAmulet.nameEn || randomAmulet.nameZh,
                amuletImg: randomAmulet.imageUrl,
                time: randomTime
            });

            // Hide after 5 seconds
            setTimeout(() => {
                setToast(null);
            }, 5000);
        };

        // Start initial delay
        timeoutId = setTimeout(scheduleNextToast, 5000);

        return () => clearTimeout(timeoutId);
    }, [enabled, amulets, minInterval, maxInterval]);

    if (!toast) return null;

    return (
        <div className="fixed top-28 lg:top-40 left-4 z-50 animate-in slide-in-from-top-8 fade-in duration-500">
            <div className="bg-[#1a1814]/95 backdrop-blur-md border border-[#c4a265]/30 shadow-2xl rounded-xl p-3 flex items-center gap-4 max-w-[300px] md:max-w-sm">
                <div className="relative w-12 h-16 rounded border border-[#c4a265]/20 shadow-sm shrink-0 overflow-hidden bg-black/40">
                  <Image 
                    src={toast.amuletImg || "/images/placeholder-amulet.png"} 
                    alt="Amulet" 
                    fill
                    sizes="48px"
                    className="object-cover" 
                  />
                </div>
                <div className="text-sm">
                    <p className="text-[#a39783] mb-1">
                        <span className="font-bold text-[#d4c5b0]">{lang === 'zh' ? toast.cityZh : toast.cityEn}</span> {lang === 'zh' ? '的' : ''} <span className="font-bold text-[#d4c5b0]">{lang === 'zh' ? toast.nameZh : toast.nameEn}</span>
                    </p>
                    <p className="text-[#f5ebd7] font-serif line-clamp-1 mb-1">
                        {lang === 'zh' ? '刚刚结缘了' : 'just acquired'} {lang === 'zh' ? toast.amuletNameZh : toast.amuletNameEn}
                    </p>
                    <p className="text-xs text-[#c4a265]">
                        {toast.time} {t('分钟前', 'mins ago')}
                    </p>
                </div>
            </div>
        </div>
    );
}
