import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  transpilePackages: ["@repo/ui"],
};

export default nextConfig;
