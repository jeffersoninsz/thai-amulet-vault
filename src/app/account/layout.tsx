import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import Link from "next/link";
import { User, Package, MapPin, Heart, LogOut } from "lucide-react";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    // General Access: Must be logged in
    if (!session) {
        redirect("/auth/signin");
    }

    return (
        <div className="min-h-screen bg-[#0d0c0b] text-[#d4c5b0] font-sans flex flex-col pt-[100px]">
            <TopNav />
            {/* Container */}
            <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">

                {/* Customer Sidebar NavBar */}
                <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2 bg-[#1a1814]/50 border border-[#c4a265]/10 p-4 rounded-xl shadow-lg">
                    <div className="mb-6 flex items-center gap-3 pb-6 border-b border-[#c4a265]/20">
                        <div className="w-12 h-12 rounded bg-[#c4a265] text-[#0d0c0b] flex items-center justify-center font-bold font-serif text-xl shadow-[0_0_15px_rgba(196,162,101,0.5)]">
                            {session.user.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                            <h3 className="text-[#f5ebd7] font-medium tracking-wide">Hello, {session.user.name || "Collector"}</h3>
                            <p className="text-xs text-[#a39783] font-mono mt-0.5">{session.user.email}</p>
                        </div>
                    </div>

                    <nav className="flex flex-col space-y-2">
                        <Link href="/account" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#c4a265]/10 text-[#a39783] hover:text-[#c4a265] transition-colors">
                            <User className="w-5 h-5" />
                            <span className="font-medium text-sm">Personal Profile</span>
                        </Link>
                        <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#c4a265]/10 text-[#a39783] hover:text-[#c4a265] transition-colors">
                            <Package className="w-5 h-5" />
                            <span className="font-medium text-sm">Order History</span>
                        </Link>
                        <Link href="/account/wishlist" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#c4a265]/10 text-[#a39783] hover:text-[#c4a265] transition-colors">
                            <Heart className="w-5 h-5" />
                            <span className="font-medium text-sm">Sacred Wishlist</span>
                        </Link>
                        <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#c4a265]/10 text-[#a39783] hover:text-[#c4a265] transition-colors">
                            <MapPin className="w-5 h-5" />
                            <span className="font-medium text-sm">Address Book</span>
                        </Link>
                    </nav>

                    <div className="mt-8 pt-6 border-t border-[#c4a265]/10">
                        <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-2 hover:bg-red-900/10 text-red-400 rounded-lg transition-colors text-sm">
                            <LogOut className="w-4 h-4" />
                            <span className="font-medium uppercase tracking-widest text-[#a39783] hover:text-red-400">Sign Out</span>
                        </Link>
                    </div>
                </aside>

                {/* C-End Main Profile Pane */}
                <main className="flex-1 bg-[#1a1814]/30 border border-[#c4a265]/10 rounded-xl p-4 md:p-8 min-h-[600px] shadow-2xl">
                    {children}
                </main>
            </div>
        </div>
    );
}
