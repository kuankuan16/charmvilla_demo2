import type { Metadata, Viewport } from "next";
import { Outfit, Noto_Sans_TC } from "next/font/google";
import "../globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { getCommerce } from "@/data/commerce";
import { locales, defaultLocale, isLocale, htmlLang, siteUrl, translator } from "@/i18n/config";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const notoTC = Noto_Sans_TC({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-noto-tc", display: "swap" });

type Props = { params: Promise<{ lang: string }> };
// Hides the preloader before first paint once it has played in this tab (key: INTRO_SEEN in components/engine/Preloader.tsx).
const introSeenScript = `try{if(sessionStorage.getItem("cv-intro-seen"))document.documentElement.classList.add("intro-seen")}catch(e){}`;

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw } = await params;
  const t = translator(isLocale(raw) ? raw : defaultLocale);
  const title = t("CHARM VILLA — 藝術即生活", "CHARM VILLA | Art as Life");
  return {
    metadataBase: new URL(siteUrl),
    title,
    description: t("藝術即生活。走進 CHARM VILLA 的日常藝廊，從皮革、金飾到茶與器物，細看材質、手作與生活的關係。",
      "Art as Life. Step into CHARM VILLA's everyday gallery: from leather and gold to tea and objects for the table, look closely at how material, handwork and daily life relate."),
    openGraph: { title, images: ["/media/gallery/CV-0422.webp"], locale: t("zh_TW", "en") },
  };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#ebeae4" };

export default async function RootLayout({ children, params }: Props & { children: React.ReactNode }) {
  const { lang: raw } = await params;
  // The proxy only ever sends "zh" or "en" here; a stray value (a file-like URL) falls back to the default and its page answers 404.
  const lang = isLocale(raw) ? raw : defaultLocale;
  // The seller for search engines (schema.org Organization), from the same facts as the footer (2026-10-02).
  const { company } = getCommerce(lang);
  const organization = { "@context": "https://schema.org", "@type": "Organization", name: "CHARM VILLA", legalName: company.name, taxID: company.taxId, url: siteUrl,
    email: company.email, telephone: "+886-2-2542-0303",
    sameAs: ["https://www.charmvilla.com.tw/", "https://www.facebook.com/CHARMVILLA8/", "https://www.instagram.com/charmvilla/"] };
  return (
    <html lang={htmlLang[lang]} className={`${outfit.variable} ${notoTC.variable}`} suppressHydrationWarning>
      <body className="bg-page text-ink"><script dangerouslySetInnerHTML={{ __html: introSeenScript }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} /><LocaleProvider lang={lang}><CartProvider>{children}<CartDrawer /></CartProvider></LocaleProvider></body>
    </html>
  );
}
