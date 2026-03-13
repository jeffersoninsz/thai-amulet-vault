import { TopNav } from "@/components/TopNav";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BlogPost() {
    return (
        <main className="min-h-screen bg-[#0d0c0b] text-[#d4c5b0] pt-32 pb-24">
            <TopNav />
            <div className="max-w-[800px] mx-auto px-6">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-[#a39783] hover:text-[#c4a265] transition-colors mb-12 text-sm tracking-widest uppercase font-mono"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Journal
                </Link>
                <header className="mb-12 border-b border-[#c4a265]/20 pb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="bg-[#c4a265] text-[#0d0c0b] text-xs font-bold px-3 py-1 rounded uppercase tracking-widest">
                            Ancient Knowledge
                        </span>
                        <time className="text-[#a39783] font-mono text-xs">
                            OCT 12, 2026
                        </time>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-[#f5ebd7] leading-tight mb-6">
                        The Grand Five: Deciphering the Phra Benjapakee
                    </h1>
                    <p className="text-xl text-[#a39783] italic font-serif leading-relaxed">
                        They are considered the pinnacle of Thai Buddhist amulets. We
                        unravel the history, artistry, and spiritual significance of the
                        five sacred forms.
                    </p>
                </header>

                {/* Dummy Content */}
                <div className="prose prose-invert prose-lg prose-p:text-[#d4c5b0] prose-p:font-serif prose-p:leading-relaxed prose-headings:text-[#f5ebd7] prose-headings:font-serif prose-a:text-[#c4a265] max-w-none">
                    <p>
                        The term "Benjapakee" originates from Pali, combining "Benja"
                        (meaning five) and "Pakee" (meaning members or associates).
                        Together, they represent a pantheon of five venerable amulets that
                        collectively embody the highest virtues of Buddhist protection,
                        fortune, charisma, and spiritual ascension.
                    </p>
                    <figure className="my-12">
                        <div className="aspect-video bg-[#1a1814] border border-[#c4a265]/20 rounded-xl overflow-hidden relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[#a39783] font-mono tracking-widest uppercase text-xs">
                                    Amulet Archive Photo
                                </span>
                            </div>
                        </div>
                        <figcaption className="text-center text-[#a39783] text-sm mt-4 italic font-serif">
                            An ancient manuscript detailing the consecration materials.
                        </figcaption>
                    </figure>

                    <h2 className="text-2xl mt-8 mb-4">The Somdej: King of Amulets</h2>
                    <p>
                        Created by Somdej Toh of Wat Rakang, Phra Somdej is universally
                        revered. Its rectangular shape and tiered dais represent the Buddha
                        meditating atop a lotus throne. It is the centerpiece of the
                        Benjapakee set.
                    </p>

                    <blockquote className="border-l-2 border-[#c4a265] pl-6 my-10 italic text-2xl text-[#f5ebd7]">
                        "To possess the Benjapakee is not merely to hold clay and powder; it
                        is to hold the distilled essence of centuries of devotion."
                    </blockquote>

                    <p>
                        While acquiring the complete set of five authentic, ancient
                        Benjapakee is a feat usually reserved for master collectors and
                        museums, understanding their lineage allows any devotee to appreciate
                        the depth of Thai spiritual artistry.
                    </p>
                </div>
            </div>
        </main>
    );
}
