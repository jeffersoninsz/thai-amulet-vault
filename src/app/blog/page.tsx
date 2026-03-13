import { TopNav } from "@/components/TopNav";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BlogIndex() {
    const articles = [
        {
            id: "benjapakee-five-buddhas",
            title: "The Grand Five: Deciphering the Phra Benjapakee",
            excerpt:
                "They are considered the pinnacle of Thai Buddhist amulets. We unravel the history, artistry, and spiritual significance of the five sacred forms.",
            date: "Oct 12, 2026",
            category: "Ancient Knowledge",
        },
        {
            id: "recognizing-holy-powders",
            title: "Essence of Earth: Recognizing Holy Powders (Phong Putthakun)",
            excerpt:
                "The soul of a powder amulet lies in its composition. Learn the traditional methods monks used to gather and consecrate sacred earth.",
            date: "Sep 28, 2026",
            category: "Material Science",
        },
        {
            id: "guide-to-kru-amulets",
            title: "Whispers from the Stupa: A Guide to 'Phra Kru' Amulets",
            excerpt:
                "Buried for centuries beneath ancient templars, Phra Kru amulets carry an unmatched antiquity. Discover their origins.",
            date: "Sep 15, 2026",
            category: "History",
        },
    ];

    return (
        <main className="min-h-screen bg-[#0d0c0b] text-[#d4c5b0] pt-32 pb-24">
            <TopNav />
            <div className="max-w-[1200px] mx-auto px-6">
                <header className="mb-20 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif text-[#f5ebd7] tracking-widest uppercase mb-4">
                        Journal
                    </h1>
                    <p className="text-[#a39783] text-lg font-serif italic max-w-2xl mx-auto">
                        Discourses on faith, history, and the profound artistry behind sacred objects.
                    </p>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {articles.map((article) => (
                        <article
                            key={article.id}
                            className="group bg-[#1a1814] rounded-2xl border border-[#c4a265]/20 overflow-hidden shadow-xl hover:border-[#c4a265]/50 transition-colors flex flex-col"
                        >
                            <div className="h-48 bg-[#0d0c0b] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1814] to-transparent z-10"></div>
                                {/* Fallback pattern/image */}
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] group-hover:scale-110 transition-transform duration-[2s]"></div>
                                <div className="absolute top-4 left-4 z-20">
                                    <span className="bg-[#c4a265] text-[#0d0c0b] text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded">
                                        {article.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 flex-1 flex flex-col justify-between">
                                <div>
                                    <time className="text-xs font-mono text-[#a39783] block mb-3">
                                        {article.date}
                                    </time>
                                    <h3 className="text-xl font-serif text-[#f5ebd7] leading-snug mb-4 group-hover:text-[#c4a265] transition-colors">
                                        <Link href={`/blog/${article.id}`}>{article.title}</Link>
                                    </h3>
                                    <p className="text-[#a39783] text-sm leading-relaxed mb-6">
                                        {article.excerpt}
                                    </p>
                                </div>
                                <Link
                                    href={`/blog/${article.id}`}
                                    className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#c4a265] hover:text-[#d5b57d]"
                                >
                                    Read Dispatch <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </main>
    );
}
