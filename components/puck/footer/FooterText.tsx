import { ComponentConfig } from "@measured/puck";

export type FooterTextProps = {
  text: string;
  fullWidth?: boolean;
};

export function FooterText({ text, fullWidth }: FooterTextProps) {
  return (
    <div className={fullWidth ? "col-span-full" : ""}>
      <p className="text-contrast-ground/70 text-sm">{text}</p>
    </div>
  );
}

export const footerTextConfig: ComponentConfig<FooterTextProps> = {
  label: "Text",
  render: FooterText,
  fields: {
    text: {
      type: "textarea",
      label: "Text",
    },
    fullWidth: {
      type: "radio",
      label: "Breite",
      options: [
        { label: "Normal", value: false },
        { label: "Volle Breite", value: true },
      ],
    },
  },
  defaultProps: {
    text: "",
    fullWidth: false,
  },
};
