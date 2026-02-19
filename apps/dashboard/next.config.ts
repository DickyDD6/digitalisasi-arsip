import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/",
      destination: "/login",
      permanent: true,
    },
  ],
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
