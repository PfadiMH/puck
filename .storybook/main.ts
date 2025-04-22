import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: [
    "../components/**/*.mdx",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    "@storybook/addon-styling-webpack",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/experimental-nextjs-vite",
    options: {},
  },
  features: {
    experimentalRSC: true,
  },
  staticDirs: ["../lib/assets"],
};
export default config;
