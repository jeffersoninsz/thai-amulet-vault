import { AmuletShowcase } from "@/components/AmuletShowcase";
import { getAmulets } from "@/api/db";
import { TopNav } from "@/components/TopNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const revalidate = 3600; // Revalidate every hour

export default async function CollectionsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await getServerSession(authOptions);
    const amulets = await getAmulets(session?.user?.role);
    const c = await searchParams;
    const categoryFilter = typeof c.c === 'string' ? c.c : null;

    // Simulate a very basic server-side pre-filter if needed, 
    // but AmuletShowcase handles most client-side filtering beautifully.
    let filteredAmulets = amulets;
    if (categoryFilter) {
        // Just a basic map, could be expanded into DB relations
        const map: Record<string, string> = {
            'powders': '粉',
            'metals': '金属',
            'woods': '木雕',
            'kru': '牌',
        };
        const term = map[categoryFilter];
        if (term) {
            filteredAmulets = amulets.filter(a => a.materialZh?.includes(term) || a.descZh?.includes(term) || a.nameZh.includes(term));
        }
    }

    return (
        <main className="min-h-screen bg-[#0d0c0b] text-[#d4c5b0] flex flex-col pt-36 lg:pt-56">
            <TopNav />
            <div className="max-w-[1600px] mx-auto px-6 mb-8 w-full text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-[#f5ebd7] tracking-[0.2em] mb-4 uppercase">
                    The Sacred Collections
                </h1>
                <p className="text-[#a39783] max-w-2xl mx-auto font-serif italic text-lg pb-8 border-b border-[#c4a265]/20">
                    Discover the most authentic, vetted amulets curated from profound lineages. Each piece carries an indelible record of its consecration.
                </p>
            </div>
            <AmuletShowcase initialAmulets={filteredAmulets} />
        </main>
    );
}
