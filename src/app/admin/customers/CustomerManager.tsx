"use client";

import { useState } from "react";
import { Users, PenTool, Search, Tag, X, Save } from "lucide-react";
import { updateUserRoleAction } from "@/app/actions";

type UserType = {
    id: string;
    email: string | null;
    name: string | null;
    role: string;
    companyName: string | null;
    createdAt: string;
};

export default function CustomerManager({ initialUsers }: { initialUsers: UserType[] }) {
    const [users, setUsers] = useState<UserType[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    // Editing state
    const [editingUser, setEditingUser] = useState<string | null>(null);
    const [editRole, setEditRole] = useState("CUSTOMER");
    const [editCompany, setEditCompany] = useState("");

    const [isSaving, setIsSaving] = useState(false);

    const handleEditClick = (user: UserType) => {
        setEditingUser(user.id);
        setEditRole(user.role);
        setEditCompany(user.companyName || "");
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
    };

    const handleSave = async (userId: string) => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('role', editRole);
            formData.append('companyName', editCompany);

            const result = await updateUserRoleAction(userId, editRole, formData);
            if (result.success) {
                setUsers(prev => prev.map(u =>
                    u.id === userId
                        ? { ...u, role: editRole, companyName: editCompany }
                        : u
                ));
                setEditingUser(null);
                alert("Customer identity updated successfully!");
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error: any) {
            alert(`Failed to save: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (user.companyName?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="bg-[#0a0908] min-h-screen text-[#d4c5b0] p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-[#c4a265]/20">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-serif text-[#f5ebd7] flex items-center gap-3">
                            <Users className="text-[#c4a265]" />
                            B2B & Customer Management
                        </h1>
                        <p className="text-sm mt-2 text-[#a39783]">
                            Manage user roles, upgrade customers to wholesale partners, and edit company profiles.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 bg-[#14120f] p-4 rounded-xl border border-[#c4a265]/10">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39783]" />
                        <input
                            type="text"
                            placeholder="Search by email, name, or company..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0a0908] border border-[#c4a265]/30 rounded-lg pl-10 pr-4 py-2 text-[#f5ebd7] placeholder-[#a39783]/50 focus:outline-none focus:border-[#c4a265] transition-colors"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="bg-[#0a0908] border border-[#c4a265]/30 rounded-lg px-4 py-2 text-[#f5ebd7] focus:outline-none focus:border-[#c4a265] sm:w-48 appearance-none"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="CUSTOMER">Customer</option>
                        <option value="WHOLESALE">Wholesale (B2B)</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-[#14120f] rounded-xl border border-[#c4a265]/20 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#1a1714] border-b border-[#c4a265]/20 font-serif text-[#f5ebd7]">
                                    <th className="p-4 uppercase text-xs tracking-wider opacity-80">User</th>
                                    <th className="p-4 uppercase text-xs tracking-wider opacity-80">Company / Store Name</th>
                                    <th className="p-4 uppercase text-xs tracking-wider opacity-80">Role Status</th>
                                    <th className="p-4 uppercase text-xs tracking-wider opacity-80 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-[#c4a265]/10 hover:bg-[#1a1714] transition-colors group">

                                        <td className="p-4">
                                            <div className="font-medium text-[#f5ebd7]">{user.name || "Unnamed"}</div>
                                            <div className="text-xs text-[#a39783] mt-1">{user.email}</div>
                                            <div className="text-[10px] text-[#a39783]/50 mt-1 font-mono">ID: {user.id.slice(0, 8)}...</div>
                                        </td>

                                        <td className="p-4">
                                            {editingUser === user.id ? (
                                                <input
                                                    type="text"
                                                    value={editCompany}
                                                    onChange={(e) => setEditCompany(e.target.value)}
                                                    placeholder="e.g. Siam Store LLC"
                                                    className="w-full bg-[#0a0908] border border-[#c4a265]/50 rounded px-2 py-1 text-sm text-[#f5ebd7] focus:outline-none focus:border-[#c4a265]"
                                                />
                                            ) : (
                                                <span className={`text-sm ${user.companyName ? 'text-[#e5cf96]' : 'text-gray-500 italic'}`}>
                                                    {user.companyName || "N/A"}
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-4">
                                            {editingUser === user.id ? (
                                                <select
                                                    value={editRole}
                                                    onChange={(e) => setEditRole(e.target.value)}
                                                    className="w-full bg-[#0a0908] border border-[#c4a265]/50 rounded px-2 py-1 text-sm text-[#f5ebd7] focus:outline-none"
                                                >
                                                    <option value="CUSTOMER">CUSTOMER</option>
                                                    <option value="WHOLESALE">WHOLESALE</option>
                                                    <option value="STAFF">STAFF</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                </select>
                                            ) : (
                                                <span className={`px-2 py-1 rounded text-xs font-mono font-bold tracking-wider
                                                    ${user.role === 'ADMIN' ? 'bg-red-900/40 text-red-400 border border-red-800/50' :
                                                        user.role === 'WHOLESALE' ? 'bg-green-900/40 text-green-400 border border-green-800/50' :
                                                            user.role === 'STAFF' ? 'bg-blue-900/40 text-blue-400 border border-blue-800/50' :
                                                                'bg-[#2a2621] text-[#a39783] border border-[#3a352a]'}`}
                                                >
                                                    {user.role}
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-4 text-right">
                                            {editingUser === user.id ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleSave(user.id)}
                                                        disabled={isSaving}
                                                        className="p-1.5 bg-green-900/40 hover:bg-green-800/60 text-green-400 rounded transition-colors disabled:opacity-50"
                                                        title="Save"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        disabled={isSaving}
                                                        className="p-1.5 bg-red-900/40 hover:bg-red-800/60 text-red-400 rounded transition-colors disabled:opacity-50"
                                                        title="Cancel"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="p-1.5 bg-[#c4a265]/10 hover:bg-[#c4a265]/20 text-[#c4a265] rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                    title="Edit Identity"
                                                >
                                                    <PenTool className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-[#a39783]">
                                            No users matched your search criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
