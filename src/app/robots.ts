import type { MetadataRoute } from "next";
import { siteUrl } from "@/i18n/config";

// Crawlers may read every page except the personal account pages and the API. Hosts other than the production domain are kept
// out of the index by the X-Robots-Tag header in next.config.ts, not here (a Disallow would hide that header from crawlers).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/account", "/zh/account", "/api/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
