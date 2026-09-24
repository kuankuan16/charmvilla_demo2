import type { Metadata, Viewport } from "next";
import { Jost, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const jost = Jost({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-jost", display: "swap" });
const notoTC = Noto_Sans_TC({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-noto-tc", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://charmvilla-gallery-site.vercel.app"),
  title: "CHARM VILLA — Everyday Luxuries",
  description: "CHARM VILLA 藝廊：真皮包、金飾、小金魚茶包與茶器。台北晶華・京都。",
  openGraph: { title: "CHARM VILLA — Everyday Luxuries", images: ["/media/gallery/CV-0422.webp"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#ebeae4" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" className={`${jost.variable} ${notoTC.variable}`}>
      <body className="bg-white text-ink">{children}</body>
    </html>
  );
}
