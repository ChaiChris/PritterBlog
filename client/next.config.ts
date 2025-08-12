import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { domains: ["localhost", "server"] },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "http://server:8081/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
