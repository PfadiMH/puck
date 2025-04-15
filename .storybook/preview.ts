import { withThemeByClassName } from "@storybook/addon-themes";
import type { Decorator, Preview } from "@storybook/react";
import "../app/globals.css";

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
      mud: "mud-theme bg-background",
      sun: "sun-theme bg-background",
    },
    defaultTheme: "mud",
  }),
];
