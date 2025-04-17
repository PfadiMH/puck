import { storybookNextJsPlugin } from "@storybook/experimental-nextjs-vite/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// This is a Vite configuration file for Storybook with Next.js and Tailwind CSS.
export default defineConfig({
  plugins: [storybookNextJsPlugin(), tailwindcss()],
});
