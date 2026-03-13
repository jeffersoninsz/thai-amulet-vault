"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { NavigationItem } from '@prisma/client';

type NavigationContextType = {
    items: NavigationItem[];
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({
    children,
    initialItems = []
}: {
    children: React.ReactNode,
    initialItems?: NavigationItem[]
}) {
    const [items, setItems] = useState<NavigationItem[]>(initialItems);

    useEffect(() => {
        if (initialItems.length > 0) {
            setItems(initialItems);
        }
    }, [initialItems]);

    return (
        <NavigationContext.Provider value={{ items }}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
}
