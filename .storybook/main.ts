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
<<<<<<< HEAD
  staticDirs: ["../lib/assets"],
=======
>>>>>>> 7c42896 (Storybook & UI component library (#41))
};
export default config;
