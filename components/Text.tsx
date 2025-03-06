import { ComponentConfig } from "@measured/puck";
import React from "react";
import { getSectionTheme } from "./contexts/ServerSectionThemeContext";

export type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  const theme = getSectionTheme();
  
  return <p className="font-sans text-wrap my-3">{text} theme: {theme}</p>;
}

export const textConfig: ComponentConfig<TextProps> = {
  render: Text,
  fields: {
    text: {
      type: "textarea",
    },
  },
  defaultProps: {
    text: "Mir sind Voll Däbii!",
  },
};
