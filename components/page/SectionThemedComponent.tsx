import { SectionThemeProvider } from "@components/contexts/SectionThemeProvider";
import { Theme } from "@lib/section-theming";
import { PropsWithChildren } from "react";

export function SectionThemedComponent({
  children,
  theme,
  id,
}: PropsWithChildren<{ theme: Theme; id?: string }>) {
  return (
    <SectionThemeProvider theme={theme}>
      <div id={id} className={`${theme}-theme bg-ground content-main overflow-hidden`}>
        {children}
      </div>
    </SectionThemeProvider>
  );
}
