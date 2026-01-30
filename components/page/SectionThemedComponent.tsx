"use client";
import { SectionThemeProvider } from "@components/contexts/SectionThemeProvider";
import { useIsNestedTheme } from "@lib/contexts/section-theme-context";
import { Theme } from "@lib/section-theming";
import { PropsWithChildren } from "react";

export function SectionThemedComponent({
  children,
  theme,
}: PropsWithChildren<{ theme: Theme }>) {
  const isNested = useIsNestedTheme();

  if (isNested) {
    return <>{children}</>;
  }

  return (
    <SectionThemeProvider theme={theme} isNested={true}>
      <div className={`${theme}-theme bg-ground content-main overflow-hidden`}>
        {children}
      </div>
    </SectionThemeProvider>
  );
}
