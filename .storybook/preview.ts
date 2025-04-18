import { withThemeByClassName } from "@storybook/addon-themes";
import type { Decorator, Preview } from "@storybook/react";
import "../app/globals.css";
import "./fonts.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;

export const decorators: Decorator[] = [
  withThemeByClassName({
    themes: {
      mud: "mud-theme bg-ground",
      sun: "sun-theme bg-ground",
    },
    defaultTheme: "mud",
  }),
];
