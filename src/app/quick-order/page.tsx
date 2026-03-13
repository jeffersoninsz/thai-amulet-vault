import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAmulets } from "@/api/db";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import BulkOrderForm from "./BulkOrderForm";
import React from 'react';

export const metadata = {
    title: "Bulk Quick Order | SiamTreasures",
};

export default async function QuickOrderPage() {
    // It's possible authOptions is in "@/app/api/auth/[...nextauth]/route"
    // Let's import it safely.
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "WHOLESALE" && session.user.role !== "ADMIN")) {
        redirect("/collections");
    }

    // Fetch amulets specifically available for wholesale (includes normal + b2b only)
    const amulets = await getAmulets(session.user.role);

    return (
        <div className="min-h-screen bg-[#0d0c0b] text-[#f5ebd7] font-sans selection:bg-[#c4a265] selection:text-[#0d0c0b] pb-24">
            <TopNav />
            {/* Spacer for fixed nav */}
            <div className="h-24 lg:h-32"></div>

            <main className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
                <header className="mb-12 border-b border-[#c4a265]/20 pb-6 pt-4">
                    <h1 className="text-3xl md:text-5xl font-serif text-[#c4a265] mb-4">
                        B2B Quick Order Portal
                    </h1>
                    <p className="text-[#a39783] max-w-2xl text-lg">
                        Streamlined ordering interface for wholesale partners. Set your quantities across available products and batch add them to your cart.
                    </p>
                </header>

                <BulkOrderForm amulets={amulets} />
            </main>

            <Footer />
        </div>
    );
}
