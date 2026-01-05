import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
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
  },
  optimizeDeps: {
    include: [
      "vitest-browser-react",
      "@tanstack/react-query",
      "react-scroll-parallax",
      "sonner",
      "clsx",
      "tailwind-merge",
    ],
  },
});
