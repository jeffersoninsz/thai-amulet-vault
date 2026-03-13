'use client';

import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

import { useLanguage } from '@/contexts/LanguageContext';

export function VisitorCounter({ enabled, baseCount, incrementRate = 5, tickInterval = 12 }: { enabled: boolean, baseCount: number, incrementRate?: number, tickInterval?: number }) {
    const { t } = useLanguage();
    const [count, setCount] = useState(baseCount);

    useEffect(() => {
        if (!enabled) return;

        // Increase count slightly over time for a lively effect (client-side specific only)
        const intervalId = setInterval(() => {
            if (Math.random() > 0.4) {
                setCount(prev => prev + Math.floor(Math.random() * incrementRate) + 1);
            }
        }, tickInterval * 1000);

        return () => clearInterval(intervalId);
    }, [enabled, incrementRate, tickInterval]);

    if (!enabled) return null;

    return (
        <div className="flex items-center gap-2 text-sm text-[#a39783] bg-[#c4a265]/10 px-3 py-1.5 rounded-full border border-[#c4a265]/20 font-mono tracking-widest" title={t("今日实时访客", "Live Views Today")}>
            <Eye className="w-4 h-4 text-[#c4a265] animate-pulse" />
            <span>{count.toLocaleString()} <span className="text-[#c4a265]/70 ml-1 text-xs">{t("访客", "VIEWS")}</span></span>
        </div>
    );
}
