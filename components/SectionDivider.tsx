import { ComponentConfig } from "@measured/puck";
import React from "react";
import { ThemeBreak } from "./SectionBreakSvgs";

export type SectionDividerProps = {};

function SectionDivider({}: SectionDividerProps) {
  return <ThemeBreak />;
}

export const sectionDividerConfig: ComponentConfig<SectionDividerProps> = {
  render: SectionDivider,
};
