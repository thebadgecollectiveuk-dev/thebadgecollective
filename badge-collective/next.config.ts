import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Allow product photos hosted on Stripe to load through next/image.
    remotePatterns: [{ protocol: "https", hostname: "files.stripe.com" }],
  },
};

export default nextConfig;
