import { getLogs } from "@/api/logger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookHeart, Clock } from "lucide-react";

export default async function AdminLogsPage() {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
        redirect("/admin"); // STAFF cannot view audit logs
    }

    const rawLogs = await getLogs();

    // Convert old text logs format if needed or prepare to shift to Prisma AuditLog later
    return (
        <div className="p-8 animate-in fade-in zoom-in-95 duration-500 max-w-7xl mx-auto">
            <div className="mb-8 border-b border-[#c4a265]/20 pb-4">
                <h2 className="text-3xl font-serif text-[#f5ebd7] tracking-widest uppercase mb-2 flex items-center gap-3">
                    <BookHeart className="w-8 h-8 text-[#c4a265]" />
                    操作监控 (Audit Logs)
                </h2>
                <p className="text-[#a39783] text-sm tracking-wide">
                    Trace all staff configurations, stock updates, and mutation history. (ADMIN ONLY)
                </p>
            </div>

            <div className="space-y-4">
                {rawLogs.slice(0, 100).map((log) => (
                    <div
                        key={log.id}
                        className="bg-[#1a1814]/80 border border-[#c4a265]/10 p-5 rounded-xl text-sm flex justify-between items-start shadow-xl"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-[#c4a265]/20 text-[#c4a265] border border-[#c4a265]/30 px-2 py-0.5 rounded text-xs font-mono font-bold tracking-wider uppercase">
                                    {log.type || "WRITE"}
                                </span>
                                <span className="text-[#f5ebd7] font-semibold text-base">
                                    {log.employeeName}
                                </span>
                            </div>

                            <div className="text-[#d4c5b0] mb-1 pl-1">
                                <span className="font-serif italic text-lg leading-relaxed">{log.action}</span>
                            </div>

                            <p className="text-xs text-[#8c8273] font-mono mt-2 bg-[#0a0908] p-2 rounded">
                                {log.details} <span className="opacity-50 ml-2">[{log.targetId}]</span>
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
                            <span className="flex items-center gap-1.5 text-[#8c8273] text-xs font-mono bg-[#0d0c0b] px-3 py-1 rounded">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(log.timestamp).toLocaleString("zh-CN", {
                                    year: 'numeric', month: '2-digit', day: '2-digit',
                                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                                })}
                            </span>
                        </div>
                    </div>
                ))}

                {rawLogs.length === 0 && (
                    <div className="p-16 border border-dashed border-[#c4a265]/20 rounded-xl text-center text-[#a39783] bg-[#1a1814]/30">
                        <p className="font-serif italic text-lg">No audit events recorded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
