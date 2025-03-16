"use client";
import { SectionThemeContext } from "@lib/contexts/section-theme-context";
import type { Theme } from "@lib/section-theming";
import { PropsWithChildren } from "react";

export const SectionThemeProvider = ({
  children,
  theme,
}: PropsWithChildren<{ theme: Theme }>) => {
  return (
    <SectionThemeContext.Provider value={{ theme }}>
      {children}
    </SectionThemeContext.Provider>
  );
};
