"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [name, setName] = useState(session?.user?.name || "");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Fallbacks if session hasn't loaded yet
    const displayEmail = session?.user?.email || "";

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, password })
            });
            const data = await res.json();

            if (res.ok) {
                alert("Profile successfully updated. If you changed your password, please log in again.");
                if (data.name) {
                    await update({ name: data.name }); // Update NextAuth session data
                }
                setPassword("");
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert("Error updating profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div>
                <h2 className="text-3xl font-serif text-[#f5ebd7] tracking-widest uppercase mb-2">Personal Profile</h2>
                <p className="text-[#a39783] text-sm">Manage your account details and password.</p>
            </div>

            <div className="bg-[#1a1814]/80 p-8 rounded-xl border border-[#c4a265]/20 max-w-2xl shadow-2xl">
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block text-xs font-mono text-[#c4a265] uppercase mb-2">Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded p-3 text-[#d4c5b0] focus:border-[#c4a265] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-[#c4a265] uppercase mb-2">Email Address (Registry Identity)</label>
                        <input
                            type="email"
                            disabled
                            value={displayEmail}
                            className="w-full bg-[#0d0c0b] border border-[#c4a265]/10 rounded p-3 text-[#d4c5b0] opacity-50 cursor-not-allowed"
                        />
                        <p className="text-[10px] text-[#8c8273] font-mono mt-2">Email changes require administrative approval due to high security standards.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-[#c4a265] uppercase mb-2">Update Password (Optional)</label>
                        <input
                            type="password"
                            placeholder="Min 8 characters or leave blank to ignore"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#0d0c0b] border border-[#c4a265]/30 rounded p-3 text-[#d4c5b0] focus:border-[#c4a265] focus:outline-none font-mono"
                        />
                    </div>

                    <div className="pt-6 border-t border-[#c4a265]/10 flex justify-end">
                        <button disabled={loading} type="submit" className="px-6 py-3 bg-[#c4a265] text-[#0d0c0b] font-bold tracking-widest uppercase rounded hover:bg-[#d5b57d] transition-colors shadow-lg disabled:opacity-50">
                            {loading ? "Synching..." : "Update Vault Identity"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
