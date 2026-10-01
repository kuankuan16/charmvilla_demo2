import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  redirects: async () => [
    ...["rose-jinxuan", "lychee-ruby", "honey-oriental-beauty", "osmanthus-baozhong", "roselle-roasted-oolong"].map(flavor => ({ source: `/products/goldfish-tea-${flavor}`, destination: "/collections/tea", permanent: true })),
    ...["goldfish-diamond-drop", "single-diamond-goldfish-earrings"].map(slug => ({ source: `/products/${slug}`, destination: "/products/diamond-goldfish-earrings", permanent: true })),
    ...["goldfish-diamond-stud", "bezel-diamond-goldfish-earrings"].map(slug => ({ source: `/products/${slug}`, destination: "/products/diamond-goldfish-stud-earrings", permanent: true })),
  ],
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
