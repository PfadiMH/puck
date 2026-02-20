import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
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
        plugins: [react(), tsconfigPaths()],
        resolve: {
          alias: {
            "@components": path.resolve(__dirname, "./components"),
            "@lib": path.resolve(__dirname, "./lib"),
            "next/image": path.resolve(
              __dirname,
              "./testing/__mocks__/next-image.tsx"
            ),
          },
        },
        define: {
          "process.env": JSON.stringify(process.env),
        },
        test: {
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
          setupFiles: "./vitest.setup.ts",
          include: ["testing/**/*.test.browser.{tsx,ts}"],
        },
        optimizeDeps: {
          entries: [],
          include: [
            "vitest-browser-react",
            "@tanstack/react-query",
            "react-scroll-parallax",
            "sonner",
            "clsx",
            "tailwind-merge",
            "lucide-react",
            "isomorphic-dompurify",
          ],
        },
      },
    ],
  },
});
