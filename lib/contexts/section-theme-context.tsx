import { Theme } from "@lib/section-theming";
import { createContext, useContext } from "react";

export const SectionThemeContext = createContext<{
  theme: Theme;
  isNested: boolean;
}>({
  theme: "mud",
  isNested: false,
});

/**
 * Hook to access the current section theme. Note that this can only be used in
 * client components with the `"use client"` pragma.
 */
export const useSectionTheme = () => useContext(SectionThemeContext).theme;
export const useIsNestedTheme = () => useContext(SectionThemeContext).isNested;
