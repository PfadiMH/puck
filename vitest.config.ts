import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        resolve: {
          alias: {
            "@components": path.resolve(__dirname, "./components"),
            "@lib": path.resolve(__dirname, "./lib"),
          },
        },
        test: {
          environment: "node",
          globals: true,
          include: ["testing/**/*.test.node.{tsx,ts}"],
        },
      },
      {
        plugins: [react()],
        resolve: {
          alias: {
            "@components": path.resolve(__dirname, "./components"),
            "@lib": path.resolve(__dirname, "./lib"),
            "@app": path.resolve(__dirname, "./app"),
          },
        },
        define: {
          "process.env": JSON.stringify(process.env),
        },
        test: {
          browser: {
            enabled: true,
            provider: playwright(),
            // https://vitest.dev/config/browser/playwright
            instances: [{ browser: "chromium" }],
          },
          setupFiles: "./vitest.setup.ts",
          include: ["testing/**/*.test.browser.{tsx,ts}"],
        },
        optimizeDeps: {
          noDiscovery: true,
          include: [
            "vitest-browser-react",
            "@tanstack/react-query",
            "react-scroll-parallax",
            "sonner",
            "clsx",
            "tailwind-merge",
            "next/image",
            "lucide-react",
            "altcha",
            "altcha-lib",
            "next/headers",
            "nodemailer",
            "@t3-oss/env-nextjs",
            "zod",
            "mongodb",
            "isomorphic-dompurify",
          ],
        },
      },
    ],
  },
});
