import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Retired product URLs, in both languages (Chinese unprefixed, English under /en).
  redirects: async () => ["", "/en"].flatMap(prefix => [
    ...["rose-jinxuan", "lychee-ruby", "honey-oriental-beauty", "osmanthus-baozhong", "roselle-roasted-oolong"].map(flavor => ({ source: `${prefix}/products/goldfish-tea-${flavor}`, destination: `${prefix}/collections/tea`, permanent: true })),
    ...["goldfish-diamond-drop", "single-diamond-goldfish-earrings"].map(slug => ({ source: `${prefix}/products/${slug}`, destination: `${prefix}/products/diamond-goldfish-earrings`, permanent: true })),
    ...["goldfish-diamond-stud", "bezel-diamond-goldfish-earrings"].map(slug => ({ source: `${prefix}/products/${slug}`, destination: `${prefix}/products/diamond-goldfish-stud-earrings`, permanent: true })),
  ]),
  // 90 is used by the tall product-page image, which must stay crisp (user 2026-10-01)
  images: { formats: ["image/avif", "image/webp"], qualities: [75, 90] },
};

export default nextConfig;
