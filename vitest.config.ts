import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import fs from "fs";
import path from "path";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

/**
 * Vite plugin that mocks "use server" modules in the browser test environment.
 *
 * In production Next.js, "use server" files are replaced with RPC stubs so their
 * server-side imports (mongodb, next-auth, sharp, etc.) never load on the client.
 * Vitest doesn't process this directive, so the full module tree loads, pulling in
 * Node.js-only packages that are incompatible with browser ESM.
 *
 * This plugin intercepts resolved modules, checks if they start with "use server",
 * and replaces them with a stub that exports async no-op functions.
 */
function mockUseServerModules(): Plugin {
  const serverModuleCache = new Map<string, boolean>();

  function isUseServerModule(resolvedPath: string): boolean {
    if (serverModuleCache.has(resolvedPath)) {
      return serverModuleCache.get(resolvedPath)!;
    }
    try {
      const content = fs.readFileSync(resolvedPath, "utf-8");
      // Check first non-empty line for "use server" directive
      const firstLine = content.trimStart().split("\n")[0]?.trim();
      const result = firstLine === '"use server";' || firstLine === "'use server';";
      serverModuleCache.set(resolvedPath, result);
      return result;
    } catch {
      serverModuleCache.set(resolvedPath, false);
      return false;
    }
  }

  return {
    name: "mock-use-server",
    enforce: "pre",
    load(id) {
      // Only process .ts/.tsx files that are "use server" modules
      if (!/\.[tj]sx?$/.test(id) || id.includes("node_modules")) return null;
      if (!isUseServerModule(id)) return null;

      // Parse the file to extract export names and generate no-op stubs
      const content = fs.readFileSync(id, "utf-8");
      const exportNames: string[] = [];
      const typeExports: string[] = [];

      for (const match of content.matchAll(
        /export\s+(?:async\s+)?function\s+(\w+)/g
      )) {
        exportNames.push(match[1]);
      }
      for (const match of content.matchAll(
        /export\s+(?:type|interface)\s+(\w+)/g
      )) {
        typeExports.push(match[1]);
      }

      // Generate stub module: async functions return undefined, types are empty
      const lines = [
        '// Auto-generated stub for "use server" module in browser tests',
      ];
      for (const name of exportNames) {
        lines.push(`export async function ${name}() { return undefined; }`);
      }
      // Re-export types as empty types so imports don't break
      for (const name of typeExports) {
        lines.push(`export type ${name} = any;`);
      }
      if (exportNames.length === 0 && typeExports.length === 0) {
        lines.push("export {};");
      }

      return lines.join("\n");
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
        plugins: [react(), mockUseServerModules()],
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
          noDiscovery: true,
          include: [
            "vitest-browser-react",
            "@tanstack/react-query",
            "react-scroll-parallax",
            "sonner",
            "clsx",
            "tailwind-merge",
            "lucide-react",
            "isomorphic-dompurify",
            "class-variance-authority",
            "use-sync-external-store",
            "use-sync-external-store/shim",
          ],
        },
      },
    ],
  },
});
