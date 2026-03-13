"use client";

import { SessionProvider } from "next-auth/react";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { SiteConfigProvider } from "@/contexts/SiteConfigContext";
import type { NavigationItem, SiteConfig } from "@prisma/client";

export function ClientProviders({
    children,
    navItems = [],
    siteConfig = null
}: {
    children: React.ReactNode;
    navItems?: NavigationItem[];
    siteConfig?: SiteConfig | null;
}) {
    return (
        <SessionProvider>
            <SiteConfigProvider initialConfig={siteConfig}>
                <NavigationProvider initialItems={navItems}>
                    {children}
                </NavigationProvider>
            </SiteConfigProvider>
        </SessionProvider>
    );
}
