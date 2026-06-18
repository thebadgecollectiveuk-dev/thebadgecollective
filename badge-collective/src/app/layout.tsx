import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thebadgecollective.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Badge Collective: Authentic, Rare, Restored Car Badges",
    template: "%s · The Badge Collective",
  },
  description:
    "Premium car badges for the enthusiast. Authentic, rare and restored marques, sourced and shipped across the UK.",
  keywords: [
    "car badges",
    "automotive badges",
    "BMW roundel",
    "Mercedes badge",
    "classic car emblems",
    "restored car badges",
    "UK",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "The Badge Collective",
    title: "The Badge Collective",
    description:
      "Premium car badges for the enthusiast. Authentic, rare and restored.",
    url: siteUrl,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "The Badge Collective" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Badge Collective",
    description:
      "Premium car badges for the enthusiast. Authentic, rare and restored.",
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <div className="grain" aria-hidden="true" />
        <div className="relative z-10 flex min-h-dvh flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <CartDrawer />
      </body>
    </html>
  );
}
