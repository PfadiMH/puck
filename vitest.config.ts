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
          // List ALL npm deps used by browser tests and their transitive
          // component imports. This prevents vite from discovering deps at
          // runtime, which triggers re-optimization and causes a race
          // condition where test files loaded during re-optimization fail
          // to resolve aliases.
          include: [
            "vitest-browser-react",
            "@puckeditor/core",
            "@tanstack/react-query",
            "react",
            "react-dom",
            "react/jsx-dev-runtime",
            "react/jsx-runtime",
            "react-scroll-parallax",

            "clsx",
            "tailwind-merge",
            "lucide-react",
            "isomorphic-dompurify",
            "sonner",
            "date-fns",
            "radix-ui",
            "react-day-picker",
          ],
        },
      },
    ],
  },
});
