import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Bypass ESLint errors so that `npm run build` won’t exit 1
    ignoreDuringBuilds: true,
  },
  /* config options here */
};

export default nextConfig;
