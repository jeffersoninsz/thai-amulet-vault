"use client";

import { useCart } from "@/contexts/CartContext";
import { TopNav } from "@/components/TopNav";
import { Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function CartPage() {
    const { items, removeFromCart, updateQuantity } = useCart();
    const { lang } = useLanguage();
    const { data: session } = useSession();
    const isWholesale = session?.user?.role === "WHOLESALE";

    const getPrice = (amulet: any) => {
        return (isWholesale && amulet.wholesalePrice) ? amulet.wholesalePrice : (amulet.price || 0);
    };

    const subtotal = items.reduce((acc, item) => acc + getPrice(item.amulet) * item.quantity, 0);
    const totalItems = items.reduce((acc, current) => acc + current.quantity, 0);

    return (
        <main className="min-h-screen bg-[#0d0c0b] text-[#d4c5b0] flex flex-col pt-32 pb-24">
            <TopNav />
            <div className="max-w-5xl mx-auto px-6 w-full animate-in fade-in slide-in-from-bottom-8">

                <h1 className="text-4xl font-serif text-[#f5ebd7] font-bold tracking-[0.2em] uppercase mb-12 border-b border-[#c4a265]/20 pb-6 flex items-center gap-4">
                    <ShoppingBag className="w-8 h-8 text-[#c4a265]" />
                    Private Acquisitions
                    <span className="text-sm font-sans tracking-normal bg-[#c4a265]/10 text-[#c4a265] py-1 px-3 rounded-full ml-auto">
                        {totalItems} items
                    </span>
                </h1>

                {items.length === 0 ? (
                    <div className="bg-[#1a1814] p-16 rounded-2xl border border-[#c4a265]/10 text-center flex flex-col items-center">
                        <ShoppingBag className="w-16 h-16 text-[#a39783]/30 mb-6" />
                        <h2 className="text-[#f5ebd7] text-2xl font-serif mb-3">Your Vault is Empty</h2>
                        <p className="text-[#a39783] mb-8">You have not selected any sacred artifacts for your collection yet.</p>
                        <Link href="/collections" className="inline-flex items-center gap-2 px-8 py-3 bg-[#c4a265] text-[#0d0c0b] font-bold rounded uppercase tracking-widest text-sm hover:bg-[#d5b57d] transition-colors">
                            Return to the Collections
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {items.map((item) => (
                                <div key={item.amulet.id} className="flex gap-6 bg-[#1a1814] p-6 rounded-2xl border border-[#c4a265]/20 hover:border-[#c4a265]/40 transition-colors shadow-xl">
                                    <div className="relative w-24 h-32 bg-[#0d0c0b] rounded-lg overflow-hidden shrink-0">
                                        <Image 
                                            src={item.amulet.imageUrl || "/images/placeholder-amulet.png"} 
                                            alt="Artifact" 
                                            fill
                                            sizes="96px"
                                            className="object-cover opacity-80" 
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-serif text-[#f5ebd7] line-clamp-2">
                                                <Link href={`/amulet/${item.amulet.id}`} className="hover:text-[#c4a265] transition-colors border-b border-transparent hover:border-[#c4a265]">
                                                    {lang === 'zh' ? item.amulet.nameZh : item.amulet.nameEn}
                                                </Link>
                                            </h3>
                                            <button
                                                onClick={() => removeFromCart(item.amulet.id)}
                                                className="text-red-500/60 hover:text-red-400 hover:bg-red-500/10 p-2 rounded transition-colors shrink-0 translate-x-2 -translate-y-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <p className="text-[#a39783] text-sm mb-4 truncate">{item.amulet.monkOrTemple} · {item.amulet.year}</p>

                                        <div className="mt-auto flex justify-between items-end border-t border-[#c4a265]/10 pt-4">
                                            <div className="flex items-center gap-4 bg-[#0d0c0b] rounded px-2 py-1 border border-[#c4a265]/20">
                                                <button
                                                    className="w-6 h-6 text-[#a39783] hover:text-[#c4a265] transition-colors"
                                                    onClick={() => updateQuantity(item.amulet.id, item.quantity - 1)}
                                                >-</button>
                                                <span className="text-[#d4c5b0] w-4 text-center text-sm">{item.quantity}</span>
                                                <button
                                                    className="w-6 h-6 text-[#a39783] hover:text-[#c4a265] transition-colors"
                                                    onClick={() => updateQuantity(item.amulet.id, item.quantity + 1)}
                                                >+</button>
                                            </div>
                                            <span className="text-2xl font-bold font-serif text-[#d5b57d]">
                                                ${getPrice(item.amulet).toFixed(2)}
                                                {isWholesale && item.amulet.wholesalePrice && (
                                                    <span className="ml-2 text-[10px] bg-blue-900/40 text-blue-400 border border-blue-900/50 px-1.5 py-0.5 rounded align-middle font-sans uppercase tracking-widest">
                                                        B2B Price
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#1a1814] p-8 rounded-2xl border border-[#c4a265]/30 sticky top-32 shadow-2xl">
                                <h3 className="text-xl font-serif text-[#f5ebd7] mb-6 border-b border-[#c4a265]/20 pb-4">Order Summary</h3>

                                <div className="space-y-4 mb-6 text-sm">
                                    <div className="flex justify-between text-[#8c8273]">
                                        <span>Subtotal ({totalItems} items)</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[#8c8273]">
                                        <span>Ceremonial Packaging</span>
                                        <span className="text-green-500/80">Complimentary</span>
                                    </div>
                                    <div className="flex justify-between text-[#8c8273]">
                                        <span>Express Dispatch</span>
                                        <span>Calculated next</span>
                                    </div>
                                </div>

                                <div className="border-t border-[#c4a265]/20 pt-6 pb-8 mb-6">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-lg text-[#f5ebd7] uppercase tracking-widest font-serif">Total Est.</span>
                                        <span className="text-4xl text-[#c4a265] font-bold font-serif">${subtotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="block w-full text-center py-4 bg-[#c4a265] text-[#0d0c0b] font-bold uppercase tracking-widest text-sm rounded hover:bg-[#d5b57d] transition-colors shadow-lg shadow-[#c4a265]/10"
                                >
                                    Proceed to Checkout
                                </Link>

                                <div className="mt-6 flex flex-col gap-2 items-center text-xs text-[#a39783] italic">
                                    <span>Secure 256-bit AES encryption</span>
                                    <span>Authenticity guaranteed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
