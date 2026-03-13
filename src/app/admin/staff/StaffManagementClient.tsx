"use client";

import React, { useState } from "react";
import { User } from "@prisma/client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Shield, ShieldAlert, Key } from "lucide-react";

type StaffData = Pick<User, "id" | "name" | "email" | "role" | "createdAt"> & { permissions?: string | null };

interface StaffManagementClientProps {
    initialStaff: StaffData[];
}

const PERMISSION_OPTS = [
    { key: "MANAGE_ORDERS", label: "Orders & Fulfillment (订单中心)" },
    { key: "MANAGE_VAULT", label: "Inventory & Vault (库存圣物设定)" },
    { key: "MANAGE_CONTENT", label: "Articles & Blog (前端内容发布)" },
];

export default function StaffManagementClient({ initialStaff }: StaffManagementClientProps) {
    const router = useRouter();
    const [staffList, setStaffList] = useState<StaffData[]>(initialStaff);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const togglePermission = async (userId: string, currentPermsStr: string | null | undefined, targetPerm: string) => {
        setLoadingId(userId);
        try {
            let permsArr: string[] = [];
            if (currentPermsStr) {
                try { permsArr = JSON.parse(currentPermsStr); } catch (e) { }
            }

            if (permsArr.includes(targetPerm)) {
                permsArr = permsArr.filter(p => p !== targetPerm);
            } else {
                permsArr.push(targetPerm);
            }

            const newPermsStr = JSON.stringify(permsArr);

            const res = await fetch(`/api/admin/staff`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, permissions: newPermsStr })
            });

            if (!res.ok) throw new Error("Failed to update staff permissions");

            toast.success("Permission updated!");

            // Optimistic update locally
            setStaffList(prev => prev.map(s =>
                s.id === userId ? { ...s, permissions: newPermsStr } : s
            ));
            router.refresh();
        } catch (error) {
            toast.error("Failed to commit permission change");
        } finally {
            setLoadingId(null);
        }
    };

    const toggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === "STAFF" ? "ADMIN" : "STAFF";
        if (!confirm(`Are you sure you want to promote/demote this user to ${newRole}?`)) return;

        setLoadingId(userId);
        try {
            const res = await fetch(`/api/admin/staff`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, role: newRole })
            });
            if (!res.ok) throw new Error("Role update failed");
            toast.success(`User is now ${newRole}`);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="bg-[#1a1814] rounded-xl p-6 border border-[#c4a265]/20 shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-[#c4a265]/20 font-serif text-[#c4a265] uppercase tracking-wider text-sm">
                            <th className="pb-3 px-4">Staff Member</th>
                            <th className="pb-3 px-4">Current Role</th>
                            <th className="pb-3 px-4">Segment Authorizations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#c4a265]/10">
                        {staffList.map((user) => {
                            const isSuper = user.role === "SUPER_ADMIN" || user.role === "ADMIN";
                            let parsedPerms: string[] = [];
                            if (user.permissions) {
                                try { parsedPerms = JSON.parse(user.permissions); } catch (e) { }
                            }
                            const isActionLoading = loadingId === user.id;

                            return (
                                <tr key={user.id} className="hover:bg-[#c4a265]/5 transition-colors">
                                    <td className="py-4 px-4 align-top">
                                        <p className="text-[#f5ebd7] font-medium">{user.name || "Unknown"}</p>
                                        <p className="text-[#a39783] font-mono text-xs mt-1">{user.email}</p>
                                    </td>
                                    <td className="py-4 px-4 align-top">
                                        <button
                                            onClick={() => toggleRole(user.id, user.role)}
                                            disabled={isActionLoading || user.role === "SUPER_ADMIN"}
                                            className={`inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-bold tracking-wider transition-all
                                              ${isSuper
                                                    ? "bg-red-900/40 text-red-400 hover:bg-red-900/60 border border-red-500/30"
                                                    : "bg-[#c4a265]/20 text-[#c4a265] hover:bg-[#c4a265]/30 border border-[#c4a265]/50"
                                                } ${(isActionLoading || user.role === "SUPER_ADMIN") && "opacity-50 cursor-not-allowed"}
                                            `}
                                        >
                                            {isSuper ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                                            {user.role}
                                        </button>
                                    </td>
                                    <td className="py-4 px-4">
                                        {isSuper ? (
                                            <span className="text-xs text-red-400 font-mono flex items-center gap-2">
                                                <Key className="w-4 h-4" />
                                                [GLOBAL SYSTEM ACCESS] (Bypass all checks)
                                            </span>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                {PERMISSION_OPTS.map(opt => {
                                                    const hasPerm = parsedPerms.includes(opt.key);
                                                    return (
                                                        <label key={opt.key} className="flex items-center gap-3 cursor-pointer group">
                                                            <div className={`w-5 h-5 flex items-center justify-center border rounded transition-colors
                                                                ${hasPerm ? "bg-[#c4a265] border-[#c4a265]" : "bg-black/50 border-[#a39783]/40 group-hover:border-[#c4a265]/50"}
                                                            `}>
                                                                {hasPerm && <div className="w-2.5 h-2.5 bg-black rounded-sm" />}
                                                            </div>
                                                            <span className={`text-sm ${hasPerm ? "text-[#f5ebd7]" : "text-[#a39783]"}`}>
                                                                {opt.label} <code className="text-xs opacity-50 ml-1">({opt.key})</code>
                                                            </span>
                                                            <button
                                                                className="opacity-0 w-0 h-0"
                                                                onClick={() => togglePermission(user.id, user.permissions, opt.key)}
                                                                disabled={isActionLoading}
                                                            />
                                                        </label>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {staffList.length === 0 && (
                    <div className="p-8 text-center text-[#a39783] text-sm">
                        No staff members found in the system.
                    </div>
                )}
            </div>
        </div>
    );
}
