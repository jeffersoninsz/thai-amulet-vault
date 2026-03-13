"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function SignInPage() {
    const { data: session } = useSession();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session) {
            const role = (session.user as any)?.role;
            if (role === "SUPER_ADMIN" || role === "ADMIN" || role === "STAFF") {
                router.push("/admin");
            } else {
                router.push("/account");
            }
        }
    }, [session, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                toast.error("Invalid credentials. Please verify your email and password.");
                setLoading(false);
            } else {
                toast.success("Identity verified. Redirecting...");

                // Force fetch session manually to immediately resolve redirect path
                const freshSessionRes = await fetch("/api/auth/session");
                const freshSession = await freshSessionRes.json();

                if (freshSession?.user) {
                    const role = freshSession.user.role;
                    if (role === "SUPER_ADMIN" || role === "ADMIN" || role === "STAFF") {
                        window.location.href = "/admin";
                    } else {
                        window.location.href = "/account";
                    }
                } else {
                    window.location.reload();
                }
            }
        } catch (err) {
            toast.error("A network error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0d0c0b] text-[#d4c5b0] flex flex-col pt-32 justify-center">
            <TopNav />
            <div className="w-full max-w-md mx-auto p-8 rounded-xl bg-[#1a1814] shadow-2xl border border-[#c4a265]/20 animate-in fade-in slide-in-from-bottom-8">
                <h1 className="text-3xl font-serif text-[#f5ebd7] font-bold text-center mb-2 tracking-widest uppercase">
                    Access Vault
                </h1>
                <p className="text-[#a39783] text-center mb-8 text-sm italic">
                    Identify yourself to access your collected treasures.
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

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-[#a39783] mb-2 font-mono">
                            Passphrase
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-[#0d0c0b] border-b border-[#c4a265]/30 text-[#d4c5b0] focus:outline-none focus:border-[#c4a265] transition-colors"
                            placeholder="••••••••"
                        />
                        <div className="flex justify-end mt-2">
                            <Link href="/auth/forgot-password" className="text-xs text-[#a39783] hover:text-[#c4a265] tracking-widest transition-colors font-mono uppercase">
                                Forgot Passphrase?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-8 bg-[#c4a265] text-[#0a0908] font-bold tracking-widest py-4 hover:bg-[#d5b57d] transition-colors rounded uppercase text-sm disabled:opacity-50"
                    >
                        {loading ? "Authenticating..." : "Authenticate"}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-[#c4a265]/20 text-center">
                    <span className="text-[#a39783] text-sm">Do not possess an account? </span>
                    <Link href="/auth/register" className="text-[#c4a265] text-sm uppercase cursor-pointer hover:underline tracking-wider font-semibold">
                        Request Registration
                    </Link>
                </div>
            </div>
        </main>
    );
}
