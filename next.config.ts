import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  experimental: {
    authInterrupts: true,
  },

  images: {
    // In dev we allow localhost MinIO; disable optimization to avoid private IP block
    unoptimized: process.env.NODE_ENV !== "production",
    remotePatterns: [
      // Local MinIO development
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/puck-files/**",
      },
      // AWS S3
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      // Cloudflare R2
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
    ],
  },
};

export default nextConfig;
