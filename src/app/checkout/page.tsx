"use client";

import { useCart } from "@/contexts/CartContext";
import { TopNav } from "@/components/TopNav";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Lock, Truck, Loader2 } from "lucide-react";
import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
    const { items, clearCart } = useCart();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        fullAddress: "",
        city: "",
        postalCode: "",
        phone: "",
        purchaseOrder: "", // Phase 7: B2B feature
        paymentMethod: "CREDIT_CARD" as "CREDIT_CARD" | "INVOICE"
    });

    const { data: session } = useSession();
    const isWholesale = session?.user?.role === "WHOLESALE";

    const getPrice = (amulet: any) => {
        return (isWholesale && amulet.wholesalePrice) ? amulet.wholesalePrice : (amulet.price || 0);
    };

    const subtotal = items.reduce((acc, item) => acc + getPrice(item.amulet) * item.quantity, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (items.length === 0) {
            setError("Your vault is empty.");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map(i => ({ amuletId: i.amulet.id, quantity: i.quantity })),
                    address: formData,
                    paymentMethod: formData.paymentMethod
                })
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    setError("You must be logged in to confirm acquisition. Please log in first.");
                } else {
                    setError(data.error || "Failed to process acquisition.");
                }
                return;
            }

            // If Stripe is active and returning a checkout URL
            if (data.url) {
                window.location.href = data.url;
                return;
            }

            // Fallback for local testing if Stripe disabled
            clearCart();
            setSuccess(true);

            // Redirect after 3s
            setTimeout(() => {
                router.push("/account/orders");
            }, 3000);

        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen bg-[#0d0c0b] text-[#d4c5b0] flex items-center justify-center pt-32 pb-24 text-center">
                <TopNav />
                <div className="bg-[#1a1814] p-16 rounded-2xl border border-[#c4a265]/30">
                    <CheckCircle2 className="w-16 h-16 text-[#c4a265] mx-auto mb-6" />
                    <h2 className="text-3xl font-serif text-[#f5ebd7] mb-4">Acquisition Confirmed</h2>
                    <p className="text-[#a39783] mb-8">Your sacred artifacts are being prepared for dispatch.</p>
                    <p className="text-sm font-mono text-[#c4a265] animate-pulse">Redirecting to Order History...</p>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[#0d0c0b] text-[#d4c5b0] flex flex-col pt-32 pb-24">
            <TopNav />
            <div className="max-w-4xl mx-auto px-6 w-full animate-in fade-in slide-in-from-bottom-8">
                <Link
                    href="/cart"
                    className="inline-flex items-center gap-2 text-[#a39783] hover:text-[#c4a265] transition-colors mb-10 text-sm tracking-widest uppercase font-mono"
                >
                    <ArrowLeft className="w-4 h-4" /> Return to Cart
                </Link>

                <h1 className="text-4xl font-serif text-[#f5ebd7] font-bold tracking-widest uppercase mb-12">
                    Consecrated Checkout
                </h1>

                {error && (
                    <div className="bg-red-900/40 border border-red-500/50 text-red-200 p-4 rounded mb-8 text-sm">
                        {error}
                        {error.includes("log in") && (
                            <Link href="/auth/signin" className="ml-4 underline font-bold text-white hover:text-[#c4a265]">
                                Go to Login &rarr;
                            </Link>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8 p-8 border border-[#c4a265]/30 rounded-2xl bg-[#1a1814]">
                        <h2 className="text-xl text-[#f5ebd7] font-serif border-b border-[#c4a265]/20 pb-4">Destined Address</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase text-[#a39783] mb-1 tracking-widest font-mono">First Name</label>
                                    <input required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} type="text" className="w-full bg-[#0d0c0b] border border-[#c4a265]/20 rounded p-3 focus:outline-none focus:border-[#c4a265] text-[#d4c5b0]" />
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-[#a39783] mb-1 tracking-widest font-mono">Last Name</label>
                                    <input required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} type="text" className="w-full bg-[#0d0c0b] border border-[#c4a265]/20 rounded p-3 focus:outline-none focus:border-[#c4a265] text-[#d4c5b0]" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs uppercase text-[#a39783] mb-1 tracking-widest font-mono">Full Address</label>
                                <input required value={formData.fullAddress} onChange={e => setFormData({ ...formData, fullAddress: e.target.value })} type="text" className="w-full bg-[#0d0c0b] border border-[#c4a265]/20 rounded p-3 focus:outline-none focus:border-[#c4a265] text-[#d4c5b0]" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase text-[#a39783] mb-1 tracking-widest font-mono">City</label>
                                    <input required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} type="text" className="w-full bg-[#0d0c0b] border border-[#c4a265]/20 rounded p-3 focus:outline-none focus:border-[#c4a265] text-[#d4c5b0]" />
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-[#a39783] mb-1 tracking-widest font-mono">Postal Code</label>
                                    <input required value={formData.postalCode} onChange={e => setFormData({ ...formData, postalCode: e.target.value })} type="text" className="w-full bg-[#0d0c0b] border border-[#c4a265]/20 rounded p-3 focus:outline-none focus:border-[#c4a265] text-[#d4c5b0]" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs uppercase text-[#a39783] mb-1 tracking-widest font-mono">Phone (for dispatch)</label>
                                <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} type="tel" className="w-full bg-[#0d0c0b] border border-[#c4a265]/20 rounded p-3 focus:outline-none focus:border-[#c4a265] text-[#d4c5b0]" />
                            </div>

                            {isWholesale && (
                                <div className="mt-8 pt-6 border-t border-[#c4a265]/10">
                                    <h3 className="text-sm uppercase text-[#c4a265] mb-4 tracking-widest font-mono flex items-center gap-2">
                                        B2B Payment Terms
                                    </h3>
                                    <div className="flex flex-col gap-3">
                                        <label className="flex items-center gap-3 text-[#d4c5b0] text-sm cursor-pointer p-3 border border-[#c4a265]/20 rounded hover:border-[#c4a265]/50 transition-colors">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="CREDIT_CARD"
                                                checked={formData.paymentMethod === "CREDIT_CARD"}
                                                onChange={() => setFormData({ ...formData, paymentMethod: "CREDIT_CARD" })}
                                                className="accent-[#c4a265] bg-transparent border-[#c4a265]"
                                            />
                                            <span>Immediate Payment (Credit Card via Stripe)</span>
                                        </label>
                                        <label className="flex items-center gap-3 text-[#d4c5b0] text-sm cursor-pointer p-3 border border-[#c4a265]/20 rounded hover:border-[#c4a265]/50 transition-colors">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="INVOICE"
                                                checked={formData.paymentMethod === "INVOICE"}
                                                onChange={() => setFormData({ ...formData, paymentMethod: "INVOICE" })}
                                                className="accent-[#c4a265] bg-transparent border-[#c4a265]"
                                            />
                                            <div className="w-full">
                                                <span>Net-30 Invoice</span>
                                                <p className="text-xs text-[#a39783] mt-1">Skip instant payment. Generates an official B2B purchase order contract for accounting.</p>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="mt-6">
                                        <label className="text-xs uppercase text-blue-400 mb-1 tracking-widest font-mono flex items-center gap-2">
                                            Purchase Order (PO Number) <span className="bg-blue-900/40 text-[10px] px-1.5 py-0.5 rounded">B2B</span>
                                        </label>
                                        <input value={formData.purchaseOrder} onChange={e => setFormData({ ...formData, purchaseOrder: e.target.value })} type="text" placeholder="e.g. PO-2024-9912 (Optional)" className="w-full bg-[#0d0c0b] border border-blue-900/50 rounded p-3 focus:outline-none focus:border-blue-400 text-[#d4c5b0] placeholder:text-[#a39783]/30" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8 flex flex-col">
                        <div className="bg-[#1a1814]/50 border border-[#c4a265]/10 rounded-2xl p-8 flex-grow">
                            <h2 className="text-xl text-[#f5ebd7] font-serif border-b border-[#c4a265]/20 pb-4 mb-6">Ceremonial Protocol</h2>
                            <ul className="space-y-4 text-sm text-[#a39783] leading-relaxed italic border-b border-[#c4a265]/20 pb-6 mb-6">
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#c4a265] shrink-0" /> Authenticity guaranteed by heritage scholars.</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#c4a265] shrink-0" /> International secure dispatch with tracking.</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#c4a265] shrink-0" /> Packaged with incantation reverence.</li>
                            </ul>

                            <div className="flex justify-between items-end text-[#f5ebd7] mb-8 mt-auto">
                                <span className="text-lg font-serif">Estimated Offering</span>
                                <span className="text-2xl font-bold font-serif text-[#c4a265]">
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>

                            <button
                                disabled={loading || items.length === 0}
                                type="submit"
                                className="w-full py-4 bg-[#c4a265] text-[#0d0c0b] flex justify-center items-center gap-2 font-bold uppercase tracking-widest text-sm rounded hover:bg-[#d5b57d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xl shadow-[#c4a265]/10 mb-8"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {loading ? "Invoking Request..." : "Confirm Acquisition \u2192"}
                            </button>

                            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#c4a265]/10">
                                <div className="flex flex-col items-center text-center group">
                                    <div className="w-12 h-12 rounded-full bg-[#c4a265]/5 border border-[#c4a265]/20 flex items-center justify-center mb-3 group-hover:border-[#c4a265]/50 transition-colors">
                                        <ShieldCheck className="w-6 h-6 text-[#c4a265]" />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest text-[#a39783] font-mono leading-tight">Authenticity<br />Guaranteed</span>
                                </div>
                                <div className="flex flex-col items-center text-center group">
                                    <div className="w-12 h-12 rounded-full bg-[#c4a265]/5 border border-[#c4a265]/20 flex items-center justify-center mb-3 group-hover:border-[#c4a265]/50 transition-colors">
                                        <Lock className="w-6 h-6 text-[#c4a265]" />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest text-[#a39783] font-mono leading-tight">Secure<br />Payment</span>
                                </div>
                                <div className="flex flex-col items-center text-center group">
                                    <div className="w-12 h-12 rounded-full bg-[#c4a265]/5 border border-[#c4a265]/20 flex items-center justify-center mb-3 group-hover:border-[#c4a265]/50 transition-colors">
                                        <Truck className="w-6 h-6 text-[#c4a265]" />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest text-[#a39783] font-mono leading-tight">Worldwide<br />Insured</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
        </main>
    )
}
