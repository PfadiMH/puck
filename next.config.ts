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
        hostname: `${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
