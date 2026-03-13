import { getSiteConfig } from "@/api/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings2 } from "lucide-react";
import StorefrontEditorClient from "./StorefrontEditorClient";

export default async function AdminStorefrontConfigPage() {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;

    let isSuper = role === "SUPER_ADMIN" || role === "ADMIN";
    let isPermitted = false;
    if (role === "STAFF" && session?.user?.permissions) {
        try {
            const perms = JSON.parse(session.user.permissions);
            if (perms.includes("MANAGE_CONTENT")) isPermitted = true;
        } catch (e) { }
    }

    if (!isSuper && !isPermitted) {
        redirect("/admin");
    }

    let config = await getSiteConfig();

    // Seed initial structure if null
    let defaultHero = {
        titleZh: "探索泰国圣物的神秘奥流",
        titleEn: "DISCOVER SACRED THAI AMULETS",
        subtitleZh: "由高僧亲自加持的正牌与法器。每一尊圣物都承载着经文的庇佑。",
        subtitleEn: "Authentic artifacts blessed by reverend monks. Each piece carries ancient protective mantras.",
        heroBannerUrl: "/images/bg-gold.webp"
    };

    let heroConfig = defaultHero;
    const cAny = config as any;
    if (cAny?.heroConfig) {
        try {
            heroConfig = { ...defaultHero, ...JSON.parse(cAny.heroConfig) };
        } catch (e) { }
    }

    return (
        <div className="p-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-8 border-b border-[#c4a265]/20 pb-6">
                <h2 className="text-3xl font-serif text-[#c4a265] tracking-widest uppercase mb-2 flex items-center gap-3">
                    <Settings2 className="w-8 h-8" />
                    前端陈列控制台 (Visual CMS)
                </h2>
                <p className="text-[#a39783] text-sm tracking-wide">
                    Live-edit the C-Side homepage hero layouts, texts, and global styles without code deployments.
                </p>
            </div>

            <StorefrontEditorClient initialHero={heroConfig} />
        </div>
    );
}
