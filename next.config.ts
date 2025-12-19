import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3030",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
