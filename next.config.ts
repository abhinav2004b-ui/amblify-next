import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/cms/:path*',
        destination: 'http://147.93.78.205/cms/:path*',
      },
    ];
  },
};

export default nextConfig;
