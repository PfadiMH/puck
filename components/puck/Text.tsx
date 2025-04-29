import { ComponentConfig } from "@measured/puck";
export type TextProps = {
  text: string[];
};

function Text({ text }: TextProps) {
  return <div>{/* <Textin text={text} /> */}</div>;
}

export const textConfig: ComponentConfig<TextProps> = {
  render: Text,
  fields: {
    text: {
      type: "textarea",
    },
  },
  defaultProps: {
    text: ["Mir sind Voll Däbii!"],
  },
};
