import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Retired product URLs, in both languages (Chinese unprefixed, English under /en).
  redirects: async () => ["", "/en"].flatMap(prefix => [
    ...["rose-jinxuan", "lychee-ruby", "honey-oriental-beauty", "osmanthus-baozhong", "roselle-roasted-oolong"].map(flavor => ({ source: `${prefix}/products/goldfish-tea-${flavor}`, destination: `${prefix}/collections/tea`, permanent: true })),
    ...["goldfish-diamond-drop", "single-diamond-goldfish-earrings"].map(slug => ({ source: `${prefix}/products/${slug}`, destination: `${prefix}/products/diamond-goldfish-earrings`, permanent: true })),
    ...["goldfish-diamond-stud", "bezel-diamond-goldfish-earrings"].map(slug => ({ source: `${prefix}/products/${slug}`, destination: `${prefix}/products/diamond-goldfish-stud-earrings`, permanent: true })),
  ]),
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
