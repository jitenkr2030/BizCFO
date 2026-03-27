import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed standalone output to fix Vercel deployment issues
  reactStrictMode: false,
  poweredByHeader: false,
  // Ensure proper asset handling
  assetPrefix: undefined,
  // Fix for server external packages
  serverExternalPackages: [],
};

export default nextConfig;
