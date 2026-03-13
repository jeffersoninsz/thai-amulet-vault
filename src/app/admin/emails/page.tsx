import { prisma } from "@/api/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Mail, Calendar, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Communications | Siam Admin"
};

export default async function AdminEmailsPage() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
        redirect("/auth/signin");
    }

    const emails = await prisma.emailLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 50 // Show last 50 emails
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <header className="flex justify-between items-end border-b border-[#c4a265]/20 pb-4">
                <div>
                    <h1 className="text-3xl font-serif text-[#f5ebd7] tracking-widest uppercase flex items-center gap-3">
                        <Mail className="w-8 h-8 text-[#c4a265]" />
                        Communications
                    </h1>
                    <p className="text-[#a39783] mt-2 font-mono text-sm tracking-wide">
                        System Dispatched Mission-Critical Transmissions
                    </p>
                </div>
            </header>

            {emails.length === 0 ? (
                <div className="bg-[#1a1814]/50 border border-[#c4a265]/10 rounded-xl p-16 text-center">
                    <Mail className="w-12 h-12 text-[#a39783]/30 mx-auto mb-4" />
                    <p className="text-[#a39783] font-mono text-sm tracking-widest uppercase">The outbox is empty.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {emails.map((email) => (
                        <div key={email.id} className="bg-[#1a1814] border border-[#c4a265]/20 rounded-xl overflow-hidden shadow-lg group hover:border-[#c4a265]/50 transition-colors">
                            <div className="p-4 border-b border-[#c4a265]/10 bg-[#0d0c0b] flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#c4a265]/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-[#c4a265]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#f5ebd7] font-semibold">{email.recipient}</p>
                                        <p className="text-xs text-[#a39783] font-mono">{email.subject}</p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-4">
                                    <span className="text-xs text-[#a39783] font-mono flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(email.createdAt).toLocaleString()}
                                    </span>
                                    {email.orderId && (
                                        <Link href={`/admin/orders/${email.orderId}`} className="text-[#c4a265] text-xs font-mono border border-[#c4a265]/30 px-2 py-1 rounded hover:bg-[#c4a265]/10 transition-colors flex items-center gap-1">
                                            View Order <ChevronRight className="w-3 h-3" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className="p-6 overflow-x-auto text-[#d4c5b0] text-sm">
                                {/* Safely render the drafted HTML email component since it is purely generated from our backend script */}
                                <div dangerouslySetInnerHTML={{ __html: email.bodyHtml }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
