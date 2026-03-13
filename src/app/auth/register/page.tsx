"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Registration failed");

            toast.success("Registration successful. Please sign in.");
            router.push("/auth/signin");

        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0d0c0b] text-[#d4c5b0] flex flex-col pt-32 justify-center pb-12">
            <TopNav />
            <div className="w-full max-w-md mx-auto p-8 rounded-xl bg-[#1a1814] shadow-2xl border border-[#c4a265]/20 animate-in fade-in slide-in-from-bottom-8">
                <h1 className="text-3xl font-serif text-[#f5ebd7] font-bold text-center mb-2 tracking-widest uppercase">
                    Begin Journey
                </h1>
                <p className="text-[#a39783] text-center mb-8 text-sm italic">
                    Register to begin collecting sacred Thai artifacts natively.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-[#a39783] mb-2 font-mono">
                            Display Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-[#0d0c0b] border-b border-[#c4a265]/30 text-[#d4c5b0] focus:outline-none focus:border-[#c4a265] transition-colors placeholder:text-[#a39783]/50"
                            placeholder="Your Name (Optional)"
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-[#a39783] mb-2 font-mono">
                            Email Address
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                            minLength={6}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 bg-[#0d0c0b] border-b border-[#c4a265]/30 text-[#d4c5b0] focus:outline-none focus:border-[#c4a265] transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-8 bg-[#c4a265] text-[#0a0908] font-bold tracking-widest py-4 hover:bg-[#d5b57d] transition-colors rounded uppercase text-sm disabled:opacity-50"
                    >
                        {loading ? "Forging Account..." : "Create Identity"}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-[#c4a265]/20 text-center flex flex-col gap-3">
                    <div className="text-sm">
                        <span className="text-[#a39783]">Already have an account? </span>
                        <Link href="/auth/signin" className="text-[#c4a265] uppercase hover:underline tracking-wider font-semibold">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
