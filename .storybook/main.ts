import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../components/ui/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-themes"],
  framework: "@storybook/nextjs-vite",
  features: {
    experimentalRSC: true,
  },
  staticDirs: ["../lib/assets"],
};
export default config;
