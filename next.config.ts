import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "80MB",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allows any hostname
      },
    ],
  },
};

export default nextConfig;
