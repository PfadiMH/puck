"use client";

import type { Theme } from "@lib/sectionTheming";
import { createContext, PropsWithChildren, useContext } from "react";

export const ClientSectionThemeContext = createContext<{
  theme: Theme;
}>({
  theme: "sun",
});

export const useSectionTheme = () =>
  useContext(ClientSectionThemeContext).theme;

export const ClientSectionThemeProvider = ({
  children,
  theme,
}: PropsWithChildren<{ theme: Theme }>) => {
  return (
    <ClientSectionThemeContext.Provider value={{ theme }}>
      {children}
    </ClientSectionThemeContext.Provider>
  );
};
