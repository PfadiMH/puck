import { ComponentConfig } from "@puckeditor/core";

export type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return <p className="text-wrap break-words">{text}</p>;
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
