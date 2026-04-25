import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: [],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '192.168.1.14:3000']
    }
  },
  allowedDevOrigins: ['192.168.1.14', 'localhost'],
};

export default nextConfig;
