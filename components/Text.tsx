import { ComponentConfig } from "@measured/puck";

export type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return <p className="text-wrap">{text}</p>;
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
