// Two locales. Chinese (the source copy) lives at the unprefixed URL; English lives under /en.
// src/proxy.ts rewrites unprefixed requests to the internal /zh segment, so every route is rendered from app/[lang].
import { keepBrand, spaceCjk } from "../lib/text/spacing";
export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";
export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);
export const htmlLang: Record<Locale, string> = { zh: "zh-Hant", en: "en" };
export const siteUrl = "https://charmvilla-gallery-site.vercel.app";
/** t("中文", "English") for one locale: the Chinese source sits next to its English version at the point of use. */
export type T = (zh: string, en: string) => string;
// Every string from t() gets a half-width space where Chinese meets a letter or digit (spaceCjk), so copy written as
// 「在2026年使用AI」 still shows 「在 2026 年使用 AI」; and CHARM VILLA is kept on one line (keepBrand).
const translators: Record<Locale, T> = { zh: (zh) => keepBrand(spaceCjk(zh)), en: (_zh, en) => keepBrand(spaceCjk(en)) };
export const translator = (lang: Locale): T => translators[lang]; // one stable function per locale (safe in hook deps)

const passthrough = ["/media/", "/brand/", "/api/", "/_next/"];
/** Locale-aware internal href. Hash-only, external and asset hrefs pass through unchanged. */
export const localeHref = (lang: Locale, href: string): string => {
  if (lang === defaultLocale || !href.startsWith("/") || passthrough.some((p) => href.startsWith(p))) return href;
  if (href === "/") return "/en";
  if (href.startsWith("/#")) return `/en${href.slice(1)}`;
  return `/en${href}`;
};
/** Path without its locale prefix ("/en/collections/tea" → "/collections/tea"). */
export const stripLocale = (pathname: string): string => pathname.replace(/^\/(?:en|zh)(?=\/|$)/, "") || "/";
/** The same page in another locale. */
export const switchLocalePath = (pathname: string, to: Locale): string => localeHref(to, stripLocale(pathname));
/** hreflang alternates for a locale-neutral path ("/collections/tea"). */
export const alternatesFor = (lang: Locale, path: string) => ({
  canonical: localeHref(lang, path),
  languages: { "zh-Hant": localeHref("zh", path), en: localeHref("en", path), "x-default": localeHref("zh", path) },
});
