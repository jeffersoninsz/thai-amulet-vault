"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { createNavigationItemAction, updateNavigationItemAction, deleteNavigationItemAction } from "@/app/actions";
import type { NavigationItem } from "@prisma/client";

export function NavigationManager({ initialItems }: { initialItems: NavigationItem[] }) {
    const [items, setItems] = useState<NavigationItem[]>(initialItems);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<NavigationItem>>({});

    const [isCreating, setIsCreating] = useState(false);
    const [createForm, setCreateForm] = useState({
        group: "HEADER_MAIN",
        labelZh: "",
        labelEn: "",
        href: "/",
        order: "0"
    });

    const groups = [
        "HEADER_MAIN",
        "HEADER_MEGA_CATEGORY",
        "HEADER_MEGA_MASTER",
        "HEADER_MEGA_EFFECT",
        "HEADER_MINI_JOURNAL",
        "FOOTER_NAV",
        "FOOTER_LEGAL"
    ];

    const handleDelete = async (id: string) => {
        if (!confirm("确定要删除该导航链接吗？")) return;
        const res = await deleteNavigationItemAction(id);
        if (res.success) {
            setItems(items.filter(i => i.id !== id));
            alert("Deleted successfully.");
        }
    };

    const handleCreate = async () => {
        const formData = new FormData();
        Object.entries(createForm).forEach(([key, value]) => formData.append(key, value));

        const res = await createNavigationItemAction(formData);
        if (res.success) {
            alert("Created successfully. Refreshing...");
            window.location.reload();
        } else {
            alert("Failed to create.");
        }
    };

    const handleSaveEdit = async (id: string) => {
        const formData = new FormData();
        Object.entries(editForm).forEach(([key, value]) => formData.append(key, String(value)));

        const res = await updateNavigationItemAction(id, formData);
        if (res.success) {
            alert("Updated successfully.");
            window.location.reload();
        } else {
            alert("Failed to update.");
        }
    };

    return (
        <div className="space-y-12">
            <div className="bg-[#1a1814] p-8 border border-[#c4a265]/20 rounded-lg shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#c4a265]"></div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[#f5ebd7] text-xl font-bold uppercase tracking-widest">
                        Navigation Links
                    </h2>
                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        className="flex items-center gap-2 bg-[#c4a265] text-[#0a0908] px-4 py-2 rounded text-sm font-bold uppercase tracking-wider hover:bg-[#d4c5b0] transition"
                    >
                        {isCreating ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {isCreating ? "Cancel" : "Add Link"}
                    </button>
                </div>

                {isCreating && (
                    <div className="bg-[#0a0908] p-6 rounded border border-[#c4a265]/30 mb-8 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-[#a39783] text-xs font-mono mb-1">Group</label>
                                <select
                                    className="w-full bg-[#1a1814] text-[#f5ebd7] border border-[#c4a265]/30 rounded p-2 text-sm"
                                    value={createForm.group}
                                    onChange={(e) => setCreateForm({ ...createForm, group: e.target.value })}
                                >
                                    {groups.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[#a39783] text-xs font-mono mb-1">Label (ZH)</label>
                                <input type="text" className="w-full bg-[#1a1814] text-[#f5ebd7] border border-[#c4a265]/30 rounded p-2 text-sm"
                                    value={createForm.labelZh} onChange={e => setCreateForm({ ...createForm, labelZh: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-[#a39783] text-xs font-mono mb-1">Label (EN)</label>
                                <input type="text" className="w-full bg-[#1a1814] text-[#f5ebd7] border border-[#c4a265]/30 rounded p-2 text-sm"
                                    value={createForm.labelEn} onChange={e => setCreateForm({ ...createForm, labelEn: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-[#a39783] text-xs font-mono mb-1">HREF / URL</label>
                                <input type="text" className="w-full bg-[#1a1814] text-[#f5ebd7] border border-[#c4a265]/30 rounded p-2 text-sm"
                                    value={createForm.href} onChange={e => setCreateForm({ ...createForm, href: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-[#a39783] text-xs font-mono mb-1">Order Index</label>
                                <input type="number" className="w-full bg-[#1a1814] text-[#f5ebd7] border border-[#c4a265]/30 rounded p-2 text-sm"
                                    value={createForm.order} onChange={e => setCreateForm({ ...createForm, order: e.target.value })} />
                            </div>
                        </div>
                        <button onClick={handleCreate} className="px-6 py-2 bg-emerald-600/20 text-emerald-500 border border-emerald-500/50 rounded text-sm hover:bg-emerald-600/30">Submit Link</button>
                    </div>
                )}

                <div className="space-y-12">
                    {groups.map(group => (
                        <div key={group}>
                            <h3 className="text-[#c4a265] text-sm font-bold uppercase tracking-widest mb-4 border-b border-[#c4a265]/20 pb-2">{group}</h3>
                            <div className="bg-[#0a0908] rounded border border-[#c4a265]/10 overflow-hidden">
                                <table className="w-full text-left text-sm text-[#d4c5b0]">
                                    <thead className="bg-[#1a1814] border-b border-[#c4a265]/20 text-[#a39783] text-xs font-mono">
                                        <tr>
                                            <th className="p-3">Order</th>
                                            <th className="p-3">Label (ZH)</th>
                                            <th className="p-3">Label (EN)</th>
                                            <th className="p-3">Href</th>
                                            <th className="p-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#c4a265]/10">
                                        {items.filter(i => i.group === group).map(item => (
                                            <tr key={item.id} className="hover:bg-[#1a1814]/50 transition-colors">
                                                {isEditing === item.id ? (
                                                    <>
                                                        <td className="p-3">
                                                            <input type="number" className="w-16 bg-[#1a1814] border border-[#c4a265]/30 rounded p-1"
                                                                value={editForm.order} onChange={e => setEditForm({ ...editForm, order: parseInt(e.target.value) || 0 })} />
                                                        </td>
                                                        <td className="p-3">
                                                            <input type="text" className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-1"
                                                                value={editForm.labelZh} onChange={e => setEditForm({ ...editForm, labelZh: e.target.value })} />
                                                        </td>
                                                        <td className="p-3">
                                                            <input type="text" className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-1"
                                                                value={editForm.labelEn} onChange={e => setEditForm({ ...editForm, labelEn: e.target.value })} />
                                                        </td>
                                                        <td className="p-3">
                                                            <input type="text" className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-1"
                                                                value={editForm.href} onChange={e => setEditForm({ ...editForm, href: e.target.value })} />
                                                        </td>
                                                        <td className="p-3 text-right flex gap-2 justify-end">
                                                            <button onClick={() => handleSaveEdit(item.id)} className="p-1 text-emerald-500 hover:bg-emerald-500/20 rounded"><Save className="w-4 h-4" /></button>
                                                            <button onClick={() => setIsEditing(null)} className="p-1 text-red-500 hover:bg-red-500/20 rounded"><X className="w-4 h-4" /></button>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="p-3 font-mono">{item.order}</td>
                                                        <td className="p-3">{item.labelZh}</td>
                                                        <td className="p-3">{item.labelEn}</td>
                                                        <td className="p-3 font-mono text-xs">{item.href}</td>
                                                        <td className="p-3 text-right">
                                                            <div className="flex gap-2 justify-end">
                                                                <button onClick={() => { setIsEditing(item.id); setEditForm(item); }} className="text-[#a39783] hover:text-[#c4a265]"><Edit2 className="w-4 h-4" /></button>
                                                                <button onClick={() => handleDelete(item.id)} className="text-red-500/70 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                                            </div>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
