import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Stripe-hosted product images (used once products come from Stripe).
    remotePatterns: [{ protocol: "https", hostname: "files.stripe.com" }],
  },
};

export default nextConfig;
