import { HeartCrack } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div>
                <h2 className="text-3xl font-serif text-[#f5ebd7] tracking-widest uppercase mb-2">Sacred Wishlist</h2>
                <p className="text-[#a39783] text-sm">Amulets you have saved for later veneration and acquisition.</p>
            </div>

            <div className="flex flex-col items-center justify-center p-24 text-[#a39783] border border-dashed border-[#c4a265]/20 bg-[#1a1814]/30 rounded-lg">
                <HeartCrack className="w-16 h-16 text-[#c4a265]/50 mb-4" />
                <p className="font-serif italic text-lg text-[#d4c5b0]">Your shrine is currently empty.</p>
                <Link href="/collections" className="mt-8 px-8 py-3 bg-[#c4a265] text-[#0d0c0b] text-sm font-bold uppercase tracking-widest rounded hover:bg-[#d5b57d] transition-colors">
                    Browse Collections
                </Link>
            </div>
        </div>
    );
}
