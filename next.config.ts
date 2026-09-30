import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  redirects: async () => [
    ...["rose-jinxuan", "lychee-ruby", "honey-oriental-beauty", "osmanthus-baozhong", "roselle-roasted-oolong"].map(flavor => ({ source: `/products/goldfish-tea-${flavor}`, destination: "/collections/tea", permanent: true })),
    { source: "/products/goldfish-diamond-stud", destination: "/products/bezel-diamond-goldfish-earrings", permanent: true },
    { source: "/products/goldfish-diamond-drop", destination: "/products/single-diamond-goldfish-earrings", permanent: true },
  ],
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
