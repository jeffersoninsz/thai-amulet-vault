import { TopNav } from "@/components/TopNav";
import Image from "next/image";

export default function StoryPage() {
    return (
        <main className="min-h-screen bg-[#0d0c0b] text-[#d4c5b0] flex flex-col pt-32 pb-24">
            <TopNav />
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-sm tracking-[0.3em] text-[#c4a265] uppercase font-mono mb-4">The Origin</h1>
                    <h2 className="text-4xl md:text-6xl font-serif text-[#f5ebd7] tracking-wider mb-6">Heartbeat of Faith</h2>
                    <div className="w-24 h-px bg-[#c4a265]/50 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
                    <div className="order-2 md:order-1 space-y-6 text-lg text-[#a39783] leading-relaxed font-serif">
                        <p>
                            Born from a deep reverence for Southeast Asian spiritual heritage, <span className="text-[#f5ebd7]">SiamTreasures</span> is not merely a gallery, but a conduit for history and faith.
                        </p>
                        <p>
                            Like the ancient temples standing resilient against time, we believe that true power lies in authentic connection. Every piece we curate holds a legacy—a lineage of dedication from masterful monks who poured their lifeforce into sacred materials.
                        </p>
                        <p>
                            Our journey began with a simple quest: to preserve the dignity of these artifacts. In a world of mass production, we return to the authentic, the consecrated, the rare.
                        </p>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-[#c4a265]/20 translate-x-4 -translate-y-4 rounded-xl -z-10 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500"></div>
                            <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#c4a265]/30">
                                <Image
                                    src="/images/siam_treasure_placeholder.png"
                                    alt="Monk blessing"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover opacity-80"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative py-20 my-20 border-y border-[#c4a265]/10 bg-[#1a1814]/50 rounded-3xl text-center px-6">
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-3xl font-serif text-[#f5ebd7] mb-8">Our Covenant with Authenticity</h3>
                        <p className="text-[#a39783] italic text-xl leading-relaxed">
                            "A genuine artifact does not just belong to its era; it bridges time to find its destined guardian. We are mere custodians in this sacred exchange."
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
