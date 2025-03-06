import { ComponentConfig } from "@measured/puck";
import { createElement } from "react";
import { Property } from "csstype";

export type HeadingProps = {
  text: string;
  textAlign: Property.TextAlign;
  level: string;
};

function Heading({ text, textAlign, level }: HeadingProps) {
  let heading = createElement(
    level,
    { style: { textAlign }, className: "text-wrap" },
    text
  );
  return heading;
}

export const headingConfig: ComponentConfig<HeadingProps> = {
  render: Heading,
  fields: {
    text: { type: "text" },
    textAlign: {
      type: "radio",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    level: {
      type: "select",
      options: [
        { label: "Heading 1", value: "h1" },
        { label: "Heading 2", value: "h2" },
        { label: "Heading 3", value: "h3" },
      ],
    },
  },
  defaultProps: {
    text: "Heading",
    textAlign: "center",
    level: "h1",
  },
};
