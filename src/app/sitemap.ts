import type { MetadataRoute } from "next";
import { products, categories, productHref, categoryHref } from "@/data/catalog";
import { locales, localeHref, siteUrl } from "@/i18n/config";

// Every page in both languages, each entry carrying its hreflang alternates.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/about", "/shopping-guide", "/privacy", "/collections/all", ...categories.map((c) => categoryHref(c.id)), ...products.map((p) => productHref(p))];
  return paths.flatMap((path) => locales.map((lang) => ({
    url: siteUrl + localeHref(lang, path),
    alternates: { languages: { "zh-Hant": siteUrl + localeHref("zh", path), en: siteUrl + localeHref("en", path) } },
  })));
}
