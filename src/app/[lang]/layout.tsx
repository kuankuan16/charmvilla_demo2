import type { Metadata, Viewport } from "next";
import { Outfit, Noto_Sans_TC } from "next/font/google";
import "../globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import NewsletterPopup from "@/components/chrome/NewsletterPopup";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { getCommerce, company } from "@/data/commerce";
import { locales, defaultLocale, isLocale, htmlLang, siteUrl, translator } from "@/i18n/config";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const notoTC = Noto_Sans_TC({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-noto-tc", display: "swap" });

type Props = { params: Promise<{ lang: string }> };
// Where the share image is fetched from: Vercel's production host for this project (charmvilla-demo2.vercel.app now, the custom
// domain once it is attached), else siteUrl. www.charmvilla.com still serves the old store, which has no such file.
const ogBase = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : siteUrl;
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
    description: t("藝術即生活。走進 CHARM VILLA 的日常藝廊，從小金魚茶包禮盒、香氛到柴燒器物，細看材質、手作與生活的關係。",
      "Art as Life. Step into CHARM VILLA's everyday gallery: from Goldfish Tea Bag gift boxes and scents to wood-fired objects for the table, look closely at how material, handwork and daily life relate."),
    // A 1200 × 630 JPG cut from the red gift box scene (scene-red-giftbox-tea-hinoki-bird.webp, the whole box in frame), the size
    // and format every share preview accepts. Absolute on the host that serves this deployment's production (see ogBase), so a link
    // shared from demo2 shows the image today, while canonical and hreflang keep pointing at siteUrl through metadataBase.
    openGraph: { title, images: [{ url: `${ogBase}/media/site/og-charm-villa-1200x630.jpg`, width: 1200, height: 630, alt: t("刺繡金魚紅色禮盒與一杯小金魚茶", "The red embroidered goldfish gift box with a cup of goldfish tea") }],
      locale: t("zh_TW", "en_US"), alternateLocale: t("en_US", "zh_TW") },
  };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#ebeae4" };

export default async function RootLayout({ children, params }: Props & { children: React.ReactNode }) {
  const { lang: raw } = await params;
  // The proxy only ever sends "zh" or "en" here; a stray value (a file-like URL) falls back to the default and its page answers 404.
  const lang = isLocale(raw) ? raw : defaultLocale;
  // The seller for search engines (schema.org Organization): the US store's contact (commerce.ts, user's document 2026-10-07).
  const { email } = getCommerce(lang);
  // legalName and address: the US company that operates the store (client's final answers 2026-10-12, A1).
  const organization = { "@context": "https://schema.org", "@type": "Organization", name: "CHARM VILLA", legalName: company.legalName, url: siteUrl, email,
    address: { "@type": "PostalAddress", streetAddress: company.street, addressLocality: company.locality, addressRegion: company.region, postalCode: company.postalCode, addressCountry: company.country },
    sameAs: ["https://www.charmvilla.com.tw/", "https://www.facebook.com/CHARMVILLA8/", "https://www.instagram.com/charmvilla/"] };
  return (
    <html lang={htmlLang[lang]} className={`${outfit.variable} ${notoTC.variable}`} suppressHydrationWarning>
      <body className="bg-page text-ink"><script dangerouslySetInnerHTML={{ __html: introSeenScript }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} /><LocaleProvider lang={lang}><CartProvider>{children}<CartDrawer /><NewsletterPopup /></CartProvider></LocaleProvider></body>
    </html>
  );
}
