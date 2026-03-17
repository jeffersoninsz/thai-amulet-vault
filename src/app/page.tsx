import { getAmulets, getAdminReviewComments, getSiteConfig, getArticles } from "@/api/db";
import Image from "next/image";
import { Sparkles, Shield, Droplet, FileText } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { AmuletShowcase } from "@/components/AmuletShowcase";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { InstagramCarousel } from "@/components/InstagramCarousel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const amulets = await getAmulets(session?.user?.role);
  const adminComments = await getAdminReviewComments();
  const config = await getSiteConfig();
  const articles = await getArticles();

  let heroTitleZh = "探索泰国圣物的神秘奥流";
  let heroTitleEn = "DISCOVER SACRED THAI AMULETS";
  let heroSubZh = "由高僧亲自加持的正牌与法器。每一尊圣物都承载着经文的庇佑。";
  let heroSubEn = "Authentic artifacts blessed by reverend monks. Each piece carries ancient protective mantras.";
  let heroBanner = "/images/bg-gold.webp";

  const cAny = config as any;

  // Banner 动态配置（从 SiteConfig 读取）
  const bannerPcUrl = (cAny?.bannerPcUrl as string) || "/images/banner_pc.png";
  const bannerMobUrl = (cAny?.bannerMobUrl as string) || "/images/banner_mob.png";
  const bannerType = (cAny?.bannerType as string) || "IMAGE";

  if (cAny?.heroConfig) {
    try {
      const parsed = JSON.parse(cAny.heroConfig);
      if (parsed.titleZh) heroTitleZh = parsed.titleZh;
      if (parsed.titleEn) heroTitleEn = parsed.titleEn;
      if (parsed.subtitleZh) heroSubZh = parsed.subtitleZh;
      if (parsed.subtitleEn) heroSubEn = parsed.subtitleEn;
      if (parsed.heroBannerUrl) heroBanner = parsed.heroBannerUrl;
    } catch (e) { }
  }

  return (
    <main className="min-h-screen bg-[#0d0c0b] text-[#d4c5b0] selection:bg-[#c4a265] selection:text-[#0d0c0b] flex flex-col">
      <TopNav />

      {/* 
        ========================================================================
        🔥 【活动海报 Banner 预留区 / Swappable Campaign Poster Banner】🔥
        使用说明:
        逢年过节或做促销活动时，只需要将本区域中的图片链接替换为您制作好的海报即可！
        为了保证完美展示，此处将 PC屏幕(宽屏) 和 无线端(竖屏) 做了分离。
        ========================================================================
      */}
      <section className="w-full pt-[140px] lg:pt-[130px] pb-8 md:pb-16 bg-[#0d0c0b]">
        {/* 外层包裹器，可根据需求加边距，此处设定为满铺以更显大气 */}
        <div className="w-full mx-auto relative group bg-[#1a1814]">
          <div className="block relative w-full overflow-hidden">

            {/* 1. PC端长条海报预留位 (MD屏幕及以上显示，默认隐藏) */}
            <div className="hidden md:block w-full h-[400px] lg:h-[600px] xl:h-[700px] relative">
              {bannerType === "VIDEO" ? (
                <video
                  src={bannerPcUrl}
                  autoPlay muted loop playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-[1.03]"
                />
              ) : (
                <Image
                  src={bannerPcUrl}
                  alt="PC 节日/活动海报"
                  fill
                  priority
                  className="object-cover transition-transform duration-[2s] group-hover:scale-[1.03]"
                />
              )}
            </div>

            {/* 2. 无线端竖排海报预留位 (默认显示，MD屏幕及以上隐藏) */}
            <div className="block md:hidden w-full h-[550px] sm:h-[600px] relative">
              {bannerType === "VIDEO" ? (
                <video
                  src={bannerMobUrl}
                  autoPlay muted loop playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-[1.03]"
                />
              ) : (
                <Image
                  src={bannerMobUrl}
                  alt="Mobile 节日/活动海报"
                  fill
                  priority
                  className="object-cover transition-transform duration-[2s] group-hover:scale-[1.03]"
                />
              )}
            </div>

            {/* 3. 海报覆盖层文本 (Desktop Only) */}
            <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-[#0d0c0b] via-[#0d0c0b]/40 to-transparent flex-col justify-end p-16 lg:p-24 pointer-events-none">
              <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded border border-[#c4a265]/50 bg-[#0d0c0b]/50 backdrop-blur-md text-[#c4a265] text-sm font-mono uppercase tracking-widest mb-4">
                  <Sparkles className="w-4 h-4" />
                  {/* 活动角标文字 ↓ */}
                  <span>{amulets.length > 0 ? `The Pinnacle of Spiritual Artistry (${amulets.length} Records)` : "Grand Consecration Event"}</span>
                </div>

                {/* 网站大标题 或 活动标题 ↓ */}
                <h2 className="text-6xl lg:text-8xl font-black font-serif text-[#f5ebd7] tracking-wider leading-none mb-6 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] uppercase">
                  {heroTitleEn}
                </h2>

                {/* 活动说明副标 ↓ */}
                <p className="text-[#f5ebd7] text-xl max-w-2xl drop-shadow-xl font-serif leading-relaxed mb-4 px-1 border-l-2 border-[#c4a265] pl-4">
                  {heroSubEn}
                </p>
                <p className="text-[#a39783] text-base max-w-2xl drop-shadow-md font-sans leading-relaxed mb-8 px-1 border-l-2 border-[#c4a265]/50 pl-4">
                  {heroSubZh}
                </p>

                <div className="inline-flex flex-row items-center gap-4 mt-8 pointer-events-auto">
                  <Link href="/collections" className="px-14 py-5 bg-[#c4a265] text-[#0d0c0b] font-bold uppercase tracking-widest text-base rounded transition-all shadow-[0_0_30px_rgba(196,162,101,0.3)] hover:bg-[#d5b57d] hover:scale-105 flex items-center justify-center">
                    Enter The Collections
                  </Link>
                  <Link href="/story" className="px-14 py-5 bg-[#0d0c0b]/50 backdrop-blur-sm border border-[#c4a265]/50 text-[#c4a265] font-bold uppercase tracking-widest text-base rounded hover:bg-[#c4a265]/10 transition-all flex items-center justify-center">
                    Our Philosophy
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* 4. Mobile Text Flow (Appears purely below the image, strictly formatted) */}
          <div className="md:hidden flex flex-col items-center justify-center pt-8 px-6 pb-4 text-center space-y-5 bg-[#1a1814]">
            <h2 className="text-4xl font-black font-serif text-[#f5ebd7] uppercase tracking-widest">
              {heroTitleEn.split(' ')[0]} <span className="text-[#c4a265]">{heroTitleEn.split(' ').slice(1).join(' ')}</span>
            </h2>
            <div className="flex flex-col gap-2 px-2">
              <p className="text-[#f5ebd7] text-sm leading-relaxed font-medium">
                {heroSubEn}
              </p>
              <p className="text-[#a39783] text-xs leading-relaxed">
                {heroSubZh}
              </p>
            </div>
            <div className="flex flex-col w-full gap-3 pt-2">
              <Link href="/collections" className="w-full py-4 bg-[#c4a265] text-[#0d0c0b] font-bold uppercase tracking-widest text-sm rounded shadow-lg">
                Enter The Collections
              </Link>
              <Link href="/story" className="w-full py-4 bg-transparent border border-[#c4a265]/50 text-[#c4a265] font-bold uppercase tracking-widest text-sm rounded">
                Our Philosophy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Value Prop */}
      <section className="bg-[#1a1814] border-y border-[#c4a265]/10 py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="text-center space-y-4">
            <Shield className="w-12 h-12 text-[#c4a265] mx-auto mb-6" />
            <h3 className="text-[#f5ebd7] font-serif text-2xl">Absolute Authenticity</h3>
            <p className="text-[#a39783] text-sm leading-relaxed">Every piece is vetted by lineage experts. We do not deal in replicas or mass-market imitations.</p>
          </div>
          <div className="text-center space-y-4">
            <Sparkles className="w-12 h-12 text-[#c4a265] mx-auto mb-6" />
            <h3 className="text-[#f5ebd7] font-serif text-2xl">Sacred Consecration</h3>
            <p className="text-[#a39783] text-sm leading-relaxed">Sourced directly from historical kru (stupas) or authentic temple ceremonies empowered by high monks.</p>
          </div>
          <div className="text-center space-y-4">
            <Droplet className="w-12 h-12 text-[#c4a265] mx-auto mb-6" />
            <h3 className="text-[#f5ebd7] font-serif text-2xl">Spiritual Anatomy</h3>
            <p className="text-[#a39783] text-sm leading-relaxed">Crafted from sacred powders (phong), ancient metals, and relics carrying profound energetic resonance.</p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <AmuletShowcase initialAmulets={amulets} />

      {/* Latest Articles Section */}
      {articles.length > 0 && (
        <section className="bg-[#0a0908] py-24 border-y border-[#c4a265]/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-serif text-[#f5ebd7] uppercase tracking-widest flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#c4a265]" />
                暹罗秘录 (The Archives)
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map((article: any) => (
                <div key={article.id} className="bg-[#1a1814] rounded-xl border border-[#c4a265]/10 overflow-hidden hover:border-[#c4a265]/40 transition-all group">
                  {article.imageUrl && (
                    <div className="relative w-full h-48 overflow-hidden bg-black/40">
                      <Image 
                        src={article.imageUrl || "/images/placeholder-amulet.png"} 
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" 
                        alt={article.titleEn} 
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#c4a265] border border-[#c4a265]/30 px-2 py-1 rounded inline-block mb-4">
                      {article.category}
                    </span>
                    <h3 className="text-[#f5ebd7] font-serif text-xl mb-2 line-clamp-2 leading-snug">{article.titleZh}</h3>
                    <h4 className="text-[#a39783] text-xs font-medium mb-4 line-clamp-1">{article.titleEn}</h4>
                    <p className="text-[#8c8273] text-sm line-clamp-3 leading-relaxed">{article.contentZh}</p>
                    <div className="mt-6 pt-4 border-t border-[#c4a265]/10 flex justify-between items-center text-xs text-[#a39783] font-mono">
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      <span>By {article.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <InstagramCarousel comments={adminComments} />
      <Footer />
    </main>
  );
}
