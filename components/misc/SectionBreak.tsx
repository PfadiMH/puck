"use client";
import {
  PremudBreak,
  PresunBreak,
} from "@components/graphics/SectionBreakSvgs";
import { useSectionTheme } from "@lib/contexts/section-theme-context";

export function SectionBreak() {
  const theme = useSectionTheme();
  return theme === "mud" ? <PremudBreak /> : <PresunBreak />;
}
