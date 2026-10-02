import type { MetadataRoute } from "next";
import { siteUrl } from "@/i18n/config";

// Crawlers may read every page except the personal account pages and the API.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/account", "/en/account", "/api/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
