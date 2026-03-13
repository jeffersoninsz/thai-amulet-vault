"use client";

import { useState } from "react";
import Link from "next/link";
import { Settings, Plus, LayoutDashboard, Search, FileText, Bell, Inbox, Settings2, ShieldCheck, Mail, Users, BookHeart, LogOut, ChevronRight, Shield, UserCog, Package, ScrollText, Menu, X } from "lucide-react";
import { AdminSidebarFooter } from "./AdminSidebarFooter";

interface AdminSidebarProps {
    canSeeVault: boolean;
    canSeeOrders: boolean;
    canSeeContent: boolean;
    isSuper: boolean;
    userName: string;
    userRole: string;
}

export function AdminSidebar({ canSeeVault, canSeeOrders, canSeeContent, isSuper, userName, userRole }: AdminSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);

    const closeSidebar = () => setIsOpen(false);

    const sidebarContent = (
        <>
            <div className="flex-1 overflow-y-auto flex flex-col">
                <div className="h-16 flex-shrink-0 flex items-center justify-center border-b border-[#c4a265]/20 hover:bg-[#c4a265]/5 transition-colors">
                    <Link href="/" className="text-xl font-serif font-bold text-[#c4a265] uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity" onClick={closeSidebar}>
                        <Shield className="w-5 h-5" />
                        Siam Admin
                    </Link>
                </div>

                <nav className="flex flex-col p-4 gap-2 flex-1">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#c4a265]/10 text-[#d4c5b0] hover:text-[#c4a265] transition-colors" onClick={closeSidebar}>
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium text-sm">管控大屏 (Dashboard)</span>
                    </Link>

                    {canSeeVault && (
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#c4a265]/10 text-[#d4c5b0] hover:text-[#c4a265] transition-colors" onClick={closeSidebar}>
                            <Package className="w-5 h-5" />
                            <span className="font-medium text-sm">库存大盘 (Vault)</span>
                        </Link>
                    )}

                    {canSeeOrders && (
                        <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#c4a265]/10 text-[#d4c5b0] hover:text-[#c4a265] transition-colors" onClick={closeSidebar}>
                            <ScrollText className="w-5 h-5" />
                            <span className="font-medium text-sm">订单中心 (Orders)</span>
                        </Link>
                    )}

                    {isSuper && (
                        <>
                            <Link href="/admin/team" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#c4a265]/10 text-[#d4c5b0] hover:text-[#c4a265] transition-colors" onClick={closeSidebar}>
                                <UserCog className="w-5 h-5" />
                                <span className="font-medium text-sm">权限大盘 (Team)</span>
                            </Link>
                            <Link href="/admin/staff" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#c4a265]/10 text-[#d4c5b0] hover:text-[#c4a265] transition-colors" onClick={closeSidebar}>
                                <Users className="w-5 h-5" />
                                <span className="font-medium text-sm">员工面板 (Staff)</span>
                            </Link>
                            <Link href="/admin/logs" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#c4a265]/10 text-[#d4c5b0] hover:text-[#c4a265] transition-colors" onClick={closeSidebar}>
                                <BookHeart className="w-5 h-5" />
                                <span className="font-medium text-sm">操作监控 (Logs)</span>
                            </Link>

                            <Link href="/admin/emails" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#c4a265]/10 text-[#d4c5b0] hover:text-[#c4a265] transition-colors" onClick={closeSidebar}>
                                <Mail className="w-5 h-5" />
                                <span className="font-medium text-sm">邮件中心 (Communications)</span>
                            </Link>

                            <Link href="/admin/settings/config" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#c4a265]/10 text-[#d4c5b0] hover:text-[#c4a265] transition-colors" onClick={closeSidebar}>
                                <Settings className="w-5 h-5" />
                                <span className="font-medium text-sm">主站参数 (Site Config)</span>
                            </Link>
                            <Link href="/admin/settings/storefront" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#c4a265]/10 text-[#d4c5b0] hover:text-[#c4a265] transition-colors" onClick={closeSidebar}>
                                <Settings2 className="w-5 h-5" />
                                <span className="font-medium text-sm">前台装修 (Storefront)</span>
                            </Link>
                            <Link href="/admin/settings/marketing" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#c4a265]/10 text-[#d4c5b0] hover:text-[#c4a265] transition-colors" onClick={closeSidebar}>
                                <Bell className="w-5 h-5" />
                                <span className="font-medium text-sm">CRO营销 (Marketing)</span>
                            </Link>

                            <Link href="/admin/settings/navigation" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#c4a265]/10 text-[#d4c5b0] hover:text-[#c4a265] transition-colors" onClick={closeSidebar}>
                                <BookHeart className="w-5 h-5" />
                                <span className="font-medium text-sm">导航枢纽 (Navigation)</span>
                            </Link>

                            <Link href="/admin/customers" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#c4a265]/10 text-[#d4c5b0] hover:text-[#c4a265] transition-colors" onClick={closeSidebar}>
                                <Users className="w-5 h-5" />
                                <span className="font-medium text-sm">B2B客户集 (Customers)</span>
                            </Link>
                        </>
                    )}

                    {canSeeContent && (
                        <Link href="/admin/articles" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#c4a265]/10 text-[#d4c5b0] hover:text-[#c4a265] transition-colors" onClick={closeSidebar}>
                            <FileText className="w-5 h-5" />
                            <span className="font-medium text-sm">资讯发布 (Articles)</span>
                        </Link>
                    )}
                </nav>
            </div>
            <AdminSidebarFooter name={userName} role={userRole} />
        </>
    );

    return (
        <>
            {/* Mobile Top Navbar */}
            <div className="md:hidden flex items-center justify-between h-16 px-4 bg-[#1a1814] border-b border-[#c4a265]/20 fixed top-0 left-0 right-0 z-40">
                <div className="flex items-center gap-2 text-[#c4a265] font-serif font-bold">
                    <Shield className="w-6 h-6" />
                    <span className="text-xl">SIAM ADMIN</span>
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-[#c4a265] bg-[#c4a265]/10 rounded-lg hover:bg-[#c4a265]/20 transition-colors">
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 z-30 pt-16 bg-black/80 backdrop-blur-sm" onClick={closeSidebar}>
                    <aside
                        className="w-64 h-full border-r border-[#c4a265]/20 bg-[#1a1814] flex flex-col justify-between animate-in slide-in-from-left duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {sidebarContent}
                    </aside>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-shrink-0 border-r border-[#c4a265]/20 bg-[#1a1814] flex-col justify-between">
                {sidebarContent}
            </aside>
        </>
    );
}
