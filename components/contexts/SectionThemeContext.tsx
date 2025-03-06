"use client";

import type { Theme } from "@lib/sectionTheming";
import { createContext, PropsWithChildren, useContext } from "react";

export const SectionThemeContext = createContext<{
  theme: Theme;
}>({
  theme: "mud",
});

export const useSectionTheme = () => useContext(SectionThemeContext).theme;

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
