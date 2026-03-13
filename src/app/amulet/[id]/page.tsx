import { getAmulets, getAmuletById, getAdminReviewComments } from "@/api/db";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AmuletDetailClient from "./AmuletDetailClient";
import { TopNav } from "@/components/TopNav";
import Link from "next/link";

export async function generateStaticParams() {
  const amulets = await getAmulets();
  return amulets.map((amulet) => ({
    id: amulet.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const amulet = await getAmuletById(id);

  if (!amulet) {
    return {
      title: "档案未找到 | Thai Amulet Vault",
    };
  }

  return {
    title: `${amulet.nameZh} | Thai Amulet Vault`,
    description:
      amulet.descZh.substring(0, 160) ||
      `${amulet.nameZh} (${amulet.nameEn}) - ${amulet.monkOrTemple} 督造于 ${amulet.year}`,
    openGraph: {
      title: amulet.nameZh,
      description:
        amulet.descZh.substring(0, 160) ||
        `${amulet.nameZh} (${amulet.nameEn}) - ${amulet.monkOrTemple}`,
      images: [
        {
          url: amulet.imageUrl,
          width: 800,
          height: 600,
          alt: amulet.nameZh,
        },
      ],
      type: "article",
    },
  };
}

export default async function AmuletDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const amulet = await getAmuletById(id);

  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role || "CUSTOMER";
  const adminComments = await getAdminReviewComments();

  if (!amulet) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0d0c0b] text-[#c4a265]">
        <TopNav />
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <p className="text-xl font-serif">未找到该圣物档案 (Artifact Not Found)</p>
          <Link href="/" className="px-6 py-2 border border-[#c4a265] rounded text-sm hover:bg-[#c4a265] hover:text-[#0d0c0b] transition-colors tracking-widest font-mono">
            返回首页 (Back to Home)
          </Link>
        </div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": amulet.nameEn || amulet.nameZh,
    "image": amulet.imageUrl,
    "description": amulet.descEn || amulet.descZh,
    "offers": {
      "@type": "Offer",
      "url": `https://siamtreasures.com/amulet/${amulet.id}`,
      "priceCurrency": "USD",
      "price": amulet.price,
      "availability": amulet.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AmuletDetailClient amulet={amulet} userRole={userRole} adminComments={adminComments} />
    </>
  );
}
