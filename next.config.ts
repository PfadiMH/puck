import type { NextConfig } from "next";

// Build remote patterns for Next.js image optimization
const remotePatterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [
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
];

// Dynamically allow the S3_PUBLIC_URL hostname (e.g. when files are proxied through the app domain)
if (process.env.S3_PUBLIC_URL) {
  try {
    const parsed = new URL(process.env.S3_PUBLIC_URL);
    remotePatterns.push({
      protocol: parsed.protocol.replace(":", "") as "http" | "https",
      hostname: parsed.hostname,
    });
  } catch {
    // Invalid URL — skip
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,

  experimental: {
    authInterrupts: true,
  },

  images: {
    // In dev we allow localhost MinIO; disable optimization to avoid private IP block
    unoptimized: process.env.NODE_ENV !== "production",
    remotePatterns,
  },
};

export default nextConfig;
