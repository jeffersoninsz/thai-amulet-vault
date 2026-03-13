"use client";

import { useState } from "react";
import { TopNav } from "@/components/TopNav";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulated delay for security/UX
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // In a real application, you'd call an API to dispatch a recovery email here.

            setSubmitted(true);
            toast.success("Recovery instructions dispatched.");
        } catch (err: any) {
            toast.error("Failed to process request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0d0c0b] text-[#d4c5b0] flex flex-col pt-32 justify-center pb-12">
            <TopNav />
            <div className="w-full max-w-md mx-auto p-8 rounded-xl bg-[#1a1814] shadow-2xl border border-[#c4a265]/20 animate-in fade-in slide-in-from-bottom-8">
                <h1 className="text-3xl font-serif text-[#f5ebd7] font-bold text-center mb-2 tracking-widest uppercase">
                    Recover Access
                </h1>

                {!submitted ? (
                    <>
                        <p className="text-[#a39783] text-center mb-8 text-sm italic">
                            Enter your email to receive a secure recovery link.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-[#a39783] mb-2 font-mono">
                                    Email Address
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#0d0c0b] border-b border-[#c4a265]/30 text-[#d4c5b0] focus:outline-none focus:border-[#c4a265] transition-colors placeholder:text-[#a39783]/50"
                                    placeholder="adept@siamtreasures.com"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-8 bg-[#c4a265] text-[#0a0908] font-bold tracking-widest py-4 hover:bg-[#d5b57d] transition-colors rounded uppercase text-sm disabled:opacity-50"
                            >
                                {loading ? "Verifying..." : "Send Recovery Link"}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-6">
                        <div className="w-16 h-16 bg-[#c4a265]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-[#c4a265]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-[#f5ebd7] mb-2">Check Your Inbox</h3>
                        <p className="text-[#a39783] text-sm leading-relaxed mb-8">
                            If an account exists for <span className="text-[#f5ebd7]">{email}</span>, we have dispatched instructions allowing you to reset your password.
                        </p>
                    </div>
                )}

                <div className="mt-6 pt-6 border-t border-[#c4a265]/20 text-center flex flex-col gap-3">
                    <div className="text-sm">
                        <Link href="/auth/signin" className="text-[#c4a265] uppercase hover:underline tracking-wider font-semibold">
                            Return to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
