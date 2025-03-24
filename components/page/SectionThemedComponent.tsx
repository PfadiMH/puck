import { SectionThemeProvider } from "@components/contexts/SectionThemeProvider";
import { breakoutConfig, PageProps } from "@lib/config/page.config";
import { Theme } from "@lib/section-theming";
import clsx from "clsx";
import { PropsWithChildren } from "react";

export function SectionThemedComponent({
  children,
  theme,
  sectionKey,
}: PropsWithChildren<{ theme: Theme; sectionKey: keyof PageProps }>) {
  return (
    <SectionThemeProvider theme={theme}>
      <div
        className={clsx([
          `${theme}-theme bg-background`,
          breakoutConfig[sectionKey],
        ])}
      >
        {children}
      </div>
    </SectionThemeProvider>
  );
}
