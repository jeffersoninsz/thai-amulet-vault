"use client";

import { useState, useTransition } from "react";
import { createArticleAction, updateArticleAction, deleteArticleAction } from "@/app/actions";

export default function AdminArticleManager({ initialArticles }: { initialArticles: any[] }) {
    const [articles, setArticles] = useState(initialArticles);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState("");

    const displayList = articles.filter(a =>
        a.titleZh.includes(searchTerm) || a.titleEn.includes(searchTerm)
    );

    async function handleCreate(formData: FormData) {
        setLoading(true);
        const res = await createArticleAction(formData);
        if (res.success) {
            window.location.reload();
        } else {
            alert("Create failed");
            setLoading(false);
        }
    }

    async function handleUpdate(id: string, formData: FormData) {
        setLoading(true);
        const res = await updateArticleAction(id, formData);
        if (res.success) {
            window.location.reload();
        } else {
            alert("Update failed");
            setLoading(false);
        }
    }

    async function handleDelete(id: string, title: string) {
        if (!window.confirm(`⚠️ 确定要删除文章 [${title}] 吗？`)) return;
        setLoading(true);
        startTransition(async () => {
            const res = await deleteArticleAction(id);
            if (res.success) {
                window.location.reload();
            } else {
                alert("Delete failed");
                setLoading(false);
            }
        });
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#1a1814] p-4 rounded-xl border border-[#c4a265]/20 gap-4">
                <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 px-4 py-2 bg-[#0a0908] border border-[#c4a265]/30 rounded text-[#d4c5b0] focus:ring-1 focus:ring-[#c4a265] outline-none"
                />
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#c4a265] text-[#0d0c0b] font-bold rounded shadow-lg shadow-[#c4a265]/20 hover:bg-[#d5b57d] hover:scale-105 transition-all text-sm whitespace-nowrap"
                >
                    {isCreating ? "取消发布" : "➕ 发布新文章"}
                </button>
            </div>

            <div className="bg-[#1a1814] border border-[#c4a265]/20 rounded-xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#c4a265]/10 text-[#c4a265] text-sm">
                            <th className="p-4 border-b border-[#c4a265]/20">标题 (ZH/EN)</th>
                            <th className="p-4 border-b border-[#c4a265]/20 w-32">分类</th>
                            <th className="p-4 border-b border-[#c4a265]/20 w-24">状态</th>
                            <th className="p-4 border-b border-[#c4a265]/20 w-32">发布日期</th>
                            <th className="p-4 border-b border-[#c4a265]/20 text-center w-24">操作</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-[#d4c5b0]">
                        {isCreating && (
                            <tr className="border-b border-[#c4a265]/30 bg-[#c4a265]/5">
                                <td colSpan={5} className="p-4">
                                    <ArticleForm
                                        isNew={true}
                                        onSave={handleCreate}
                                        onCancel={() => setIsCreating(false)}
                                        loading={loading}
                                    />
                                </td>
                            </tr>
                        )}
                        {displayList.map(article => (
                            <tr key={article.id} className="border-b border-[#c4a265]/10 hover:bg-[#c4a265]/5 transition-colors">
                                {editingId === article.id ? (
                                    <td colSpan={5} className="p-4">
                                        <ArticleForm
                                            article={article}
                                            isNew={false}
                                            onSave={(fd: FormData) => handleUpdate(article.id, fd)}
                                            onCancel={() => setEditingId(null)}
                                            loading={loading}
                                        />
                                    </td>
                                ) : (
                                    <>
                                        <td className="p-4 font-medium">
                                            <div className="line-clamp-1">{article.titleZh}</div>
                                            <div className="text-xs text-[#a39783] mt-1 line-clamp-1">{article.titleEn}</div>
                                        </td>
                                        <td className="p-4 font-mono text-xs">{article.category}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${article.isPublished ? 'bg-green-900/20 text-green-400 border border-green-500/50' : 'bg-amber-900/20 text-amber-500 border border-amber-500/50'}`}>
                                                {article.isPublished ? '已发布' : '草稿'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-[#a39783]">{new Date(article.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex flex-col gap-2">
                                                <button onClick={() => setEditingId(article.id)} className="px-3 py-1 bg-[#1a1814] text-[#c4a265] border border-[#c4a265]/30 rounded hover:bg-[#c4a265] hover:text-[#0d0c0b] transition-colors text-xs">编辑</button>
                                                <button onClick={() => handleDelete(article.id, article.titleZh)} disabled={loading || isPending} className="px-3 py-1 bg-[#1a1814] text-red-500 border border-red-900/50 rounded hover:bg-red-500 hover:text-white transition-colors text-xs">删除</button>
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
    );
}

function ArticleForm({ article = {}, isNew, onSave, onCancel, loading }: any) {
    return (
        <form action={onSave} className="space-y-4 bg-[#0d0c0b] p-4 rounded border border-[#c4a265]/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-xs text-[#a39783]">标题 (中文)</label><input name="titleZh" defaultValue={article.titleZh} required className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-2 text-[#d4c5b0] outline-none" /></div>
                <div><label className="text-xs text-[#a39783]">Title (EN)</label><input name="titleEn" defaultValue={article.titleEn} className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-2 text-[#d4c5b0] outline-none" /></div>

                <div>
                    <label className="text-xs text-[#a39783]">分类 (Category)</label>
                    <select name="category" defaultValue={article.category || "NEWS"} className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-2 text-[#d4c5b0] outline-none">
                        <option value="NEWS">NEWS (新闻)</option>
                        <option value="KNOWLEDGE">KNOWLEDGE (知识)</option>
                        <option value="CEREMONY">CEREMONY (法会)</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs text-[#a39783]">发布状态</label>
                    <select name="isPublished" defaultValue={article.isPublished ? "true" : "false"} className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-2 text-[#d4c5b0] outline-none">
                        <option value="true">已发布 (Published)</option>
                        <option value="false">草稿 (Draft)</option>
                    </select>
                </div>

                <div className="md:col-span-2"><label className="text-xs text-[#a39783]">内容 (中文)</label><textarea name="contentZh" defaultValue={article.contentZh} rows={4} className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-2 text-[#d4c5b0] outline-none" /></div>
                <div className="md:col-span-2"><label className="text-xs text-[#a39783]">Content (EN)</label><textarea name="contentEn" defaultValue={article.contentEn} rows={4} className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-2 text-[#d4c5b0] outline-none" /></div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 border border-[#c4a265]/30 text-[#a39783] rounded hover:bg-[#1a1814] text-xs">取消</button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-[#c4a265] text-[#0d0c0b] font-bold rounded hover:bg-[#d5b57d] disabled:opacity-50 text-xs">
                    {loading ? "保存中..." : (isNew ? "确认发布" : "保存修改")}
                </button>
            </div>
        </form>
    );
}
