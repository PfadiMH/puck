import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import path from "path";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

/**
 * Custom vite plugin to resolve tsconfig path aliases and mock next/image.
 * Using a plugin instead of resolve.alias because the alias config does not
 * reliably propagate to the browser vite server in CI (Linux).
 */
function resolveAliases(): Plugin {
  const aliases: Record<string, string> = {
    "@components": path.resolve(__dirname, "./components"),
    "@lib": path.resolve(__dirname, "./lib"),
    "@app": path.resolve(__dirname, "./app"),
  };

  return {
    name: "resolve-aliases",
    async resolveId(source, importer, options) {
      // Mock next/image — it relies on Next.js context unavailable in vitest
      if (source === "next/image") {
        return path.resolve(__dirname, "./testing/__mocks__/next-image.tsx");
      }

      // Resolve tsconfig path aliases
      for (const [prefix, target] of Object.entries(aliases)) {
        if (source === prefix || source.startsWith(prefix + "/")) {
          const rewritten = source.replace(prefix, target);
          const resolved = await this.resolve(rewritten, importer, {
            ...options,
            skipSelf: true,
          });
          return resolved;
        }
      }
    },
  };
}

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
        plugins: [resolveAliases(), react()],
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
