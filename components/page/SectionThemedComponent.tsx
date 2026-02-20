"use client";
import { SectionThemeProvider } from "@components/contexts/SectionThemeProvider";
import { useIsNestedTheme } from "@lib/contexts/section-theme-context";
import { Theme } from "@lib/section-theming";
import { PropsWithChildren } from "react";

export function SectionThemedComponent({
  children,
  theme,
  id,
}: PropsWithChildren<{ theme: Theme; id?: string }>) {
  const isNested = useIsNestedTheme();

  if (isNested) {
    return <>{children}</>;
  }

  return (
    <SectionThemeProvider theme={theme} isNested={true}>
      <div id={id} className={`${theme}-theme bg-ground content-main overflow-hidden`}>
        {children}
      </div>
    </SectionThemeProvider>
  );
}
