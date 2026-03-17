import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { ClientProviders } from "@/components/ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: "SiamTreasures | 暹罗御藏",
  description:
    "Explore the authentic Siam Treasures collection with detailed history and records.",
};

import { getSiteConfig, getAmulets, getNavigationItems, getMarketingConfig } from "@/api/db";

import { FakeOrderToast } from "@/components/FakeOrderToast";
import { VisitorCounter } from "@/components/VisitorCounter";
import { Toaster } from "react-hot-toast";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig();
  const marketingConfig = await getMarketingConfig();
  const amulets = await getAmulets();
  const navItems = await getNavigationItems();

  const simplifiedAmulets = amulets.map(a => ({
    nameZh: a.nameZh,
    nameEn: a.nameEn,
    imageUrl: a.imageUrl
  }));

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <LanguageProvider>
          <ClientProviders navItems={navItems} siteConfig={config as any}>
            <CartProvider>
              {/* Global Settings & Utilities wrapper */}
              {children}

              <Toaster
                position="top-center"
                toastOptions={{
                  style: {
                    background: '#1a1814',
                    color: '#f5ebd7',
                    border: '1px solid rgba(196, 162, 101, 0.2)'
                  }
                }}
              />
              <FakeOrderToast
                amulets={simplifiedAmulets}
                enabled={marketingConfig.fakeSalesEnabled}
                minInterval={marketingConfig.popupIntervalMin}
                maxInterval={marketingConfig.popupIntervalMax}
                customCities={marketingConfig.fakeSalesCities}
                customNames={marketingConfig.fakeSalesNames}
              />
              <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40">
                <VisitorCounter
                  enabled={marketingConfig.fakeViewsEnabled}
                  baseCount={marketingConfig.baseViews}
                  incrementRate={marketingConfig.viewIncreaseRate}
                  tickInterval={marketingConfig.visitorTickInterval}
                />
              </div>
            </CartProvider>
          </ClientProviders>
        </LanguageProvider>
      </body>
    </html>
  );
}
