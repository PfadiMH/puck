import { SectionThemeProvider } from "@components/contexts/SectionThemeProvider";
import { Theme } from "@lib/section-theming";
import { PropsWithChildren } from "react";

export function SectionThemedComponent({
  children,
  theme,
}: PropsWithChildren<{ theme: Theme }>) {
  return (
    <SectionThemeProvider theme={theme}>
      <div className={`${theme}-theme bg-background`}>{children}</div>
    </SectionThemeProvider>
  );
}
