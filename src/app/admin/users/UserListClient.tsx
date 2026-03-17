"use client";

import { useState } from "react";
import { Shield, ShieldAlert, User, MoreVertical, Check, X, Trash2 } from "lucide-react";
import { deleteUserAction, updateUserRoleAction } from "@/app/actions";

interface UserListClientProps {
    initialUsers: any[];
    currentUserId: string;
}

export default function UserListClient({ initialUsers, currentUserId }: UserListClientProps) {
    const [users, setUsers] = useState(initialUsers);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleRoleChange = async (userId: string, newRole: string) => {
        if (userId === currentUserId) return;

        setLoadingId(userId);
        try {
            const result = await updateUserRoleAction(userId, newRole);
            if (result.success) {
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            } else {
                alert(result.error || "Failed to update role");
            }
        } catch (e) {
            alert("Failed to update role");
        } finally {
            setLoadingId(null);
        }
    };

    const handleDelete = async (userId: string) => {
        if (userId === currentUserId) return;
        if (!confirm("确定要永久注销此信众的档案吗？此操作不可逆。(Are you sure you want to permanently delete this user?)")) return;

        setLoadingId(userId);
        try {
            const result = await deleteUserAction(userId);
            if (result.success) {
                setUsers(users.filter(u => u.id !== userId));
            } else {
                alert(result.error || "Failed to delete user");
            }
        } catch (e) {
            alert("Failed to delete user");
        } finally {
            setLoadingId(null);
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "ADMIN": return <ShieldAlert className="w-4 h-4 text-red-500" />;
            case "STAFF": return <Shield className="w-4 h-4 text-[#c4a265]" />;
            default: return <User className="w-4 h-4 text-[#a39783]" />;
        }
    };

    return (
        <div className="bg-[#14120f] border border-[#c4a265]/20 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#c4a265]/10 bg-[#1a1814]/80">
                            <th className="px-6 py-4 text-xs uppercase font-mono tracking-widest text-[#a39783]">信众档案 (Identity)</th>
                            <th className="px-6 py-4 text-xs uppercase font-mono tracking-widest text-[#a39783]">神职阶位 (Role)</th>
                            <th className="px-6 py-4 text-xs uppercase font-mono tracking-widest text-[#a39783]">皈依时间 (Joined)</th>
                            <th className="px-6 py-4 text-xs uppercase font-mono tracking-widest text-[#a39783]">法旨修改 (Actions)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#c4a265]/5">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-[#1a1814]/40 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#c4a265]/10 border border-[#c4a265]/20 flex items-center justify-center text-[#c4a265] text-lg font-serif">
                                            {user.name?.[0] || user.email?.[0] || "?"}
                                        </div>
                                        <div>
                                            <p className="text-[#f5ebd7] font-medium">{user.name || "无名修行者"}</p>
                                            <p className="text-[#8c8273] text-xs font-mono">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-black/40 border border-[#c4a265]/10 w-fit">
                                        {getRoleIcon(user.role)}
                                        <span className={`text-[10px] font-mono tracking-wider font-bold ${user.role === 'ADMIN' ? 'text-red-400' : 'text-[#c4a265]'}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-[#8c8273] text-sm font-mono">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2 items-center">
                                        {user.id !== currentUserId ? (
                                            <>
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    disabled={loadingId === user.id}
                                                    className="bg-black text-[#d4c5b0] border border-[#c4a265]/30 rounded px-2 py-1 text-xs outline-none focus:border-[#c4a265] transition-colors disabled:opacity-50"
                                                >
                                                    <option value="CUSTOMER">CUSTOMER</option>
                                                    <option value="STAFF">STAFF</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                </select>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={loadingId === user.id}
                                                    className="p-1 text-[#a39783] hover:text-red-400 hover:bg-red-400/10 rounded transition-all disabled:opacity-30"
                                                    title="注销档案"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-xs italic text-[#8c8273] border border-white/10 rounded px-2 py-1">当前圣座 (Self)</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {users.length === 0 && (
                <div className="p-12 text-center text-[#8c8273] italic">
                    尚未发现任何信众记录。
                </div>
            )}
        </div>
    );
}
