import { getMarketingConfig } from "@/api/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Bell } from "lucide-react";
import MarketingEditorClient from "./MarketingEditorClient";

export default async function AdminMarketingPage() {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;

    let isSuper = role === "SUPER_ADMIN" || role === "ADMIN";
    let isPermitted = false;
    if (role === "STAFF" && session?.user?.permissions) {
        try {
            const perms = JSON.parse(session.user.permissions);
            // Group marketing under MANAGE_CONTENT for now
            if (perms.includes("MANAGE_CONTENT")) isPermitted = true;
        } catch (e) { }
    }

    if (!isSuper && !isPermitted) {
        redirect("/admin");
    }

    const mConfig = await getMarketingConfig();

    return (
        <div className="p-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-8 border-b border-[#c4a265]/20 pb-6">
                <h2 className="text-3xl font-serif text-[#c4a265] tracking-widest uppercase mb-2 flex items-center gap-3">
                    <Bell className="w-8 h-8" />
                    营销增强控制台 (Marketing CRO)
                </h2>
                <p className="text-[#a39783] text-sm tracking-wide">
                    Configure Fake Sales Popups and Simulated Active Viewer Counters to weaponize conversions.
                </p>
            </div>

            <MarketingEditorClient initialConfig={mConfig} />
        </div>
    );
}
