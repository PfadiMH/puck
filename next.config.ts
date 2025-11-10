import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pfadimhdev.blob.core.windows.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "127.0.0.1",
        port: "10000",
        pathname: "/devstoreaccount1/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
