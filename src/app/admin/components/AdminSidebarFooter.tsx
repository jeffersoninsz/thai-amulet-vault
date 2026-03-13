"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface AdminSidebarFooterProps {
    name: string;
    role: string;
}

export function AdminSidebarFooter({ name, role }: AdminSidebarFooterProps) {
    return (
        <div className="p-4 border-t border-[#c4a265]/20 shrink-0">
            <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-[#c4a265] text-[#0d0c0b] flex items-center justify-center font-bold font-serif text-sm">
                    {name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold text-[#f5ebd7] truncate">{name}</span>
                    <span className="text-xs text-[#a39783] bg-[#c4a265]/10 border border-[#c4a265]/20 px-1.5 py-0.5 rounded mt-1 text-center font-mono inline-block">
                        {role}
                    </span>
                </div>
            </div>
            <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full mt-2 flex items-center gap-3 px-4 py-2 hover:bg-red-900/20 text-red-400 rounded-lg transition-colors text-sm"
            >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">退出登录 (Logout)</span>
            </button>
        </div>
    );
}
