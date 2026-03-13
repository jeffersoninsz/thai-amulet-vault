"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SiteConfig } from '@prisma/client';

type SiteConfigContextType = {
    config: SiteConfig | null;
};

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export function SiteConfigProvider({
    children,
    initialConfig
}: {
    children: React.ReactNode,
    initialConfig: SiteConfig | null
}) {
    const [config, setConfig] = useState<SiteConfig | null>(initialConfig);

    useEffect(() => {
        if (initialConfig) {
            setConfig(initialConfig);
        }
    }, [initialConfig]);

    return (
        <SiteConfigContext.Provider value={{ config }}>
            {children}
        </SiteConfigContext.Provider>
    );
}

export function useSiteConfig() {
    const context = useContext(SiteConfigContext);
    if (context === undefined) {
        throw new Error('useSiteConfig must be used within a SiteConfigProvider');
    }
    return context;
}
