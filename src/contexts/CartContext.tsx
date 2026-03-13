"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { Amulet } from "@/types/amulet";

export interface CartItem {
  amulet: Amulet;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (amulet: Amulet) => void;
  addMultipleToCart: (newItems: { amulet: Amulet, quantity: number }[]) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { data: session } = useSession();

  const isWholesale = session?.user?.role === "WHOLESALE";

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem("tav_cart");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage when items change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("tav_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (amulet: Amulet) => {
    // Phase 7: Calculate MOQ for B2B users
    const minQty = isWholesale ? (amulet.moq || 1) : 1;

    setItems((prev) => {
      const existing = prev.find((item) => item.amulet.id === amulet.id);
      if (existing) {
        return prev.map((item) =>
          item.amulet.id === amulet.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { amulet, quantity: minQty }];
    });
    setIsCartOpen(true); // Open cart automatically when adding
  };

  const addMultipleToCart = (newItems: { amulet: Amulet, quantity: number }[]) => {
    setItems((prev) => {
      const next = [...prev];

      newItems.forEach(newItem => {
        const existingIdx = next.findIndex((item) => item.amulet.id === newItem.amulet.id);
        if (existingIdx !== -1) {
          next[existingIdx] = {
            ...next[existingIdx],
            quantity: next[existingIdx].quantity + newItem.quantity
          };
        } else {
          next.push(newItem);
        }
      });

      return next;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.amulet.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    setItems((prev) => {
      const item = prev.find(i => i.amulet.id === id);
      if (!item) return prev;

      const minQty = isWholesale ? (item.amulet.moq || 1) : 1;

      // If user tries to set qty below MOQ (and they didn't explicitly delete it entirely to 0)
      if (qty > 0 && qty < minQty) {
        qty = minQty;
      }

      if (qty <= 0) return prev.filter((item) => item.amulet.id !== id);
      return prev.map((item) => item.amulet.id === id ? { ...item, quantity: qty } : item);
    });
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        addMultipleToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
