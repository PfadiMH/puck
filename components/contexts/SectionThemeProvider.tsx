"use client";
import { SectionThemeContext } from "@lib/contexts/section-theme-context";
import type { Theme } from "@lib/section-theming";
import { PropsWithChildren } from "react";

export const SectionThemeProvider = ({
  children,
  theme,
  isNested = false,
}: PropsWithChildren<{ theme: Theme; isNested?: boolean }>) => {
  return (
    <SectionThemeContext.Provider value={{ theme, isNested }}>
      {children}
    </SectionThemeContext.Provider>
  );
};
