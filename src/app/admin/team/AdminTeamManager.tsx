"use client";

import { UserCog, Trash2, Mail, ShieldAlert } from "lucide-react";
import { useState } from "react";

export function AdminTeamManager({ initialTeam }: { initialTeam: any[] }) {
    const [team, setTeam] = useState(initialTeam);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleCreateStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/admin/team", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name, role: "STAFF" })
            });
            const data = await res.json();

            if (res.ok) {
                setTeam([data.user, ...team]);
                setEmail(""); setPassword(""); setName("");
                alert("Staff account created successfully.");
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert("Error creating staff.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStaff = async (id: string) => {
        if (!confirm("Are you sure you want to suspend this staff member? This cannot be undone from the dashboard.")) return;

        try {
            const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
            if (res.ok) {
                setTeam(team.filter(t => t.id !== id));
            } else {
                alert("Failed to delete member");
            }
        } catch (e) {
            alert("Exception deleting member");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-[#1a1814]/80 border border-[#c4a265]/20 rounded-xl p-6 shadow-xl space-y-4">
                <h3 className="font-serif text-[#f5ebd7] text-lg border-b border-[#c4a265]/10 pb-2 mb-4">Provision New Staff (Operative)</h3>
                <form onSubmit={handleCreateStaff} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-xs uppercase font-mono text-[#a39783] mb-1">Display Name</label>
                        <input required value={name} onChange={e => setName(e.target.value)} type="text" placeholder="John Wick" className="w-full bg-[#0a0908] border border-[#c4a265]/20 text-[#d4c5b0] text-sm p-3 rounded focus:border-[#c4a265] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs uppercase font-mono text-[#a39783] mb-1">Email <Mail className="inline w-3 h-3 ml-1" /></label>
                        <input required value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="staff@siamtreasures.com" className="w-full bg-[#0a0908] border border-[#c4a265]/20 text-[#d4c5b0] text-sm p-3 rounded focus:border-[#c4a265] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs uppercase font-mono text-[#a39783] mb-1">Secure Password</label>
                        <input required value={password} onChange={e => setPassword(e.target.value)} type="text" placeholder="Minimum 8 chars" minLength={8} className="w-full bg-[#0a0908] border border-[#c4a265]/20 text-[#d4c5b0] text-sm p-3 rounded focus:border-[#c4a265] focus:outline-none" />
                    </div>
                    <button disabled={loading} type="submit" className="bg-[#c4a265] text-[#0d0c0b] py-3 px-4 rounded font-bold uppercase tracking-widest text-xs hover:bg-[#d5b57d] transition-colors disabled:opacity-50">
                        {loading ? "Registering..." : "+ Authorize Operative"}
                    </button>
                </form>
            </div>

            <div className="bg-[#1a1814]/50 border border-[#c4a265]/10 rounded-xl overflow-hidden shadow-2xl">
                <table className="w-full text-left bg-[#1a1814]">
                    <thead className="bg-[#0a0908] text-[#c4a265] text-xs uppercase font-mono tracking-widest border-b border-[#c4a265]/20">
                        <tr>
                            <th className="p-5">Agent ID / Name</th>
                            <th className="p-5">Comms Line (Email)</th>
                            <th className="p-5 text-center">Clearance Level</th>
                            <th className="p-5 text-center">Status</th>
                            <th className="p-5 text-center">Revoke Access</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-[#d4c5b0] divide-y divide-[#c4a265]/10">
                        {team.map(member => (
                            <tr key={member.id} className="hover:bg-[#c4a265]/5 transition-colors group">
                                <td className="p-5">
                                    <div className="font-bold text-[#f5ebd7] flex items-center gap-2">
                                        {member.role === "ADMIN" && <ShieldAlert className="w-4 h-4 text-red-500" />}
                                        {member.name || "Unknown"}
                                    </div>
                                    <div className="text-[10px] text-[#8c8273] font-mono mt-1 opacity-70 uppercase">ID: {member.id}</div>
                                </td>
                                <td className="p-5 font-mono text-xs opacity-90 text-[#a39783]">{member.email}</td>
                                <td className="p-5 text-center">
                                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest border ${member.role === 'ADMIN' ? 'bg-purple-900/40 text-purple-400 border-purple-800' : 'bg-blue-900/40 text-blue-400 border-blue-800'
                                        }`}>
                                        {member.role}
                                    </span>
                                </td>
                                <td className="p-5 text-center font-mono text-xs">
                                    <span className="text-green-500 bg-green-900/20 px-2 py-1 border border-green-500/30 rounded uppercase tracking-wider">Active</span>
                                </td>
                                <td className="p-5 text-center">
                                    {member.role === "ADMIN" ? (
                                        <span className="text-[#8c8273] text-xs italic opacity-50">Unalterable</span>
                                    ) : (
                                        <button onClick={() => handleDeleteStaff(member.id)} className="text-red-500/50 hover:text-red-400 hover:bg-red-500/10 p-2 rounded transition-all opacity-0 group-hover:opacity-100">
                                            <Trash2 className="w-4 h-4 mx-auto" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
