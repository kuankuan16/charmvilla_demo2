import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  redirects: async () => ["rose-jinxuan", "lychee-ruby", "honey-oriental-beauty", "osmanthus-baozhong", "roselle-roasted-oolong"].map(flavor => ({ source: `/products/goldfish-tea-${flavor}`, destination: "/collections/tea", permanent: true })),
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
