import { ComponentConfig } from "@measured/puck";
import React from "react";

export type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return <p className="font-sans text-wrap py-3">{text}</p>;
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
