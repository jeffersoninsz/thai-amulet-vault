'use client';

import { useState } from 'react';
import { postCommentAction } from '@/app/actions';
import { useLanguage } from '@/contexts/LanguageContext';

import { Star } from 'lucide-react';

export function CommentsList({ amuletId, comments, userRole = "CUSTOMER" }: { amuletId: string, comments: any[], userRole?: string }) {
    const { t } = useLanguage();
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const isStaff = userRole === 'ADMIN' || userRole === 'STAFF';

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const res = await postCommentAction(amuletId, author, content, rating, imageUrl);
        setLoading(false);
        if (res.success) {
            setMsg(t('留言提交成功！等待后台审核显示。', 'Comment submitted successfully! Awaiting moderator approval.'));
            setContent('');
        } else {
            setMsg(t('提交失败，请重试。', 'Submission failed, please try again.'));
        }
    }

    const approvedComments = comments.filter(c => c.isApproved);

    return (
        <div className="mt-16 bg-[#1a1814] border border-[#c4a265]/20 rounded-xl p-6 shadow-xl">
            <h3 className="text-[#f5ebd7] font-serif text-xl mb-6 tracking-widest border-b border-[#c4a265]/20 pb-4">
                {t("结缘留言墙", "Amulet Community Wall")}
            </h3>

            <div className="space-y-6 mb-8">
                {approvedComments.length === 0 ? (
                    <div className="text-[#a39783] text-sm italic text-center py-4">
                        {t("暂时没有留言，成为第一个留言结缘的人吧。", "No messages yet. Be the first to share your spiritual connection.")}
                    </div>
                ) : (
                    approvedComments.map(c => (
                        <div key={c.id} className="border-b border-[#c4a265]/10 pb-4 animate-in fade-in">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[#c4a265] font-bold text-sm tracking-wider">{c.author}</span>
                                <span className="text-[#a39783] text-xs">{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < (c.rating ?? 5) ? 'text-[#c4a265] fill-[#c4a265]' : 'text-[#a39783]/30'}`} />
                                ))}
                            </div>
                            <p className="text-[#d4c5b0] text-sm leading-relaxed mb-3">{c.content}</p>

                            {c.images && JSON.parse(c.images).length > 0 && (
                                <div className="flex gap-2 mt-2">
                                    {JSON.parse(c.images).map((imgUrl: string, idx: number) => (
                                        <img key={idx} src={imgUrl} alt="Review Image" className="w-20 h-20 object-cover rounded border border-[#c4a265]/20" />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 bg-[#0d0c0b] p-6 rounded-lg border border-[#c4a265]/10">
                <h4 className="text-[#d4c5b0] text-sm font-bold mb-4">✍️ {t("写下您的祈愿或结缘意向", "Write down your prayers or connection intentions")}</h4>

                {isStaff && (
                    <div className="bg-[#c4a265]/5 p-4 rounded border border-[#c4a265]/20 mb-4 animate-in fade-in">
                        <div className="text-xs text-[#c4a265] mb-2 font-bold tracking-widest uppercase">Admin / Staff Control (伪装评价生成器)</div>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="text-[#a39783] text-xs mb-1 block">Rating (0-5)</label>
                                <input type="number" min="0" max="5" value={rating} onChange={e => setRating(parseInt(e.target.value) || 5)} className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-2 text-[#d4c5b0] text-sm outline-none focus:border-[#c4a265] transition-colors" />
                            </div>
                            <div className="flex-[2]">
                                <label className="text-[#a39783] text-xs mb-1 block">Image URL (Optional)</label>
                                <input type="text" placeholder="https://..." value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-2 text-[#d4c5b0] text-sm outline-none focus:border-[#c4a265] transition-colors" />
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <input
                            type="text"
                            placeholder={t("您的称呼 (选填)", "Your Name (Optional)")}
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-3 text-[#d4c5b0] text-sm outline-none focus:border-[#c4a265] transition-colors"
                        />
                    </div>
                </div>
                <div>
                    <textarea
                        placeholder={t("在此输入您的评价、心愿或结缘咨询...", "Enter your evaluation, wishes, or inquiries here...")}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={3}
                        className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-3 text-[#d4c5b0] text-sm outline-none focus:border-[#c4a265] transition-colors resize-y"
                    ></textarea>
                </div>
                {msg && <p className="text-sm text-[#c4a265]">{msg}</p>}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-[#c4a265] text-[#0d0c0b] text-sm font-bold rounded hover:bg-[#d5b57d] disabled:opacity-50 transition-colors tracking-widest shadow-lg shadow-[#c4a265]/20"
                    >
                        {loading ? t('提交中...', 'Submitting...') : t('提交留言', 'Submit Comment')}
                    </button>
                </div>
            </form>
        </div>
    );
}
