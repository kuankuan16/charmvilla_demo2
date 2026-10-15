import type { Metadata } from "next";
import type { Img } from "@/data/content";
import { alternatesFor, localeHref, siteUrl, translator, type Locale } from "../../i18n/config";

export const absoluteUrl = (path: string) => new URL(path, siteUrl).href;
export const pageUrl = (lang: Locale, path: string) => absoluteUrl(localeHref(lang, path));
/** Formatting controls belong in the layout, not search snippets or entity names. */
export const seoText = (text: string) => text.replace(/[\u200b\u2060\ufeff]/g, "").replace(/\s+/g, " ").trim();
export function snippet(text: string, lang: Locale) {
  const plain = seoText(text);
  const limit = lang === "zh" ? 90 : 160;
  if (plain.length <= limit) return plain;
  const cut = plain.slice(0, limit - 1);
  const end = lang === "en" ? cut.lastIndexOf(" ") : -1;
  return `${end > limit * .65 ? cut.slice(0, end) : cut}…`;
}

export function homeSeo(lang: Locale) {
  const t = translator(lang);
  return {
    title: t("小金魚茶包・台灣茶禮盒｜CHARM VILLA 美國商店", "Goldfish Tea Bags & Taiwanese Tea Gifts | CHARM VILLA"),
    description: t("探索 CHARM VILLA 小金魚茶包、台灣茶禮盒、檜木器物與柴燒筷架。美國線上商店由 Haoying LLC 經營，從加州出貨，提供中英文商品與購物資訊。", "Explore CHARM VILLA Goldfish Tea Bags, Taiwanese tea gifts and hinoki wood pieces. Shop the US online store, operated by Haoying LLC and shipping from California."),
  };
}

type PageMetadata = { lang: Locale; path: string; title: string; description: string; image?: Pick<Img, "src" | "alt" | "w" | "h">; article?: boolean };
/** Next shallow-merges nested metadata. Supply the full OG/Twitter object on every public page. */
export function pageMetadata({ lang, path, title, description, image, article = false }: PageMetadata): Metadata {
  const t = translator(lang);
  const cleanTitle = seoText(title);
  const summary = snippet(description, lang);
  const share = image ? { url: absoluteUrl(image.src), width: image.w, height: image.h, alt: seoText(image.alt) }
    : { url: absoluteUrl("/media/site/og-charm-villa-1200x630.jpg"), width: 1200, height: 630, alt: t("刺繡金魚紅色禮盒與一杯小金魚茶", "The red embroidered goldfish gift box with a cup of goldfish tea") };
  return {
    title: cleanTitle, description: summary,
    alternates: alternatesFor(lang, path),
    openGraph: { type: article ? "article" : "website", title: cleanTitle, description: summary, url: pageUrl(lang, path), siteName: "CHARM VILLA", locale: lang === "zh" ? "zh_TW" : "en_US", alternateLocale: lang === "zh" ? "en_US" : "zh_TW", images: [share] },
    twitter: { card: "summary_large_image", title: cleanTitle, description: summary, images: [{ url: share.url, alt: share.alt }] },
  };
}
