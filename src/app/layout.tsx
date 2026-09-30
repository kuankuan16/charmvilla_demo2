import type { Metadata, Viewport } from "next";
import { Outfit, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const notoTC = Noto_Sans_TC({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-noto-tc", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://charmvilla-gallery-site.vercel.app"),
  title: "CHARM VILLA — 藝術即生活",
  description: "藝術即生活。走進 CHARM VILLA 的日常藝廊，從皮革、金飾到茶與器物，細看材質、手作與生活的關係。",
  openGraph: { title: "CHARM VILLA — 藝術即生活", images: ["/media/gallery/CV-0422.webp"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#ebeae4" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" className={`${outfit.variable} ${notoTC.variable}`}>
      <body className="bg-page text-ink">{children}</body>
    </html>
  );
}
