import type { MetadataRoute } from "next";
import { products, categories, productHref, categoryHref } from "@/data/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://charmvilla-gallery-site.vercel.app";
  return ["/", "/collections/all", ...categories.map((c) => categoryHref(c.id)), ...products.map(productHref)].map((path) => ({ url: base + path }));
}
