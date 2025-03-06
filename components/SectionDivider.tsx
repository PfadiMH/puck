import { ComponentConfig } from "@measured/puck";
import React from "react";

export type SectionDividerProps = {};

function SectionDivider({}: SectionDividerProps) {
  return <div>SectionDivider</div>;
}

export const sectionDividerConfig: ComponentConfig<SectionDividerProps> = {
  render: SectionDivider,
};
