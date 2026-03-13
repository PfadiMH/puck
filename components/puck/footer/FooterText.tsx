import { ComponentConfig } from "@puckeditor/core";

export type FooterTextProps = {
  text: string;
  fullWidth?: boolean;
};

export function FooterText({ text, fullWidth }: FooterTextProps) {
  return (
    <div className={fullWidth ? "col-span-full" : undefined}>
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
      label: "Width",
      options: [
        { label: "Normal", value: false },
        { label: "Full Width", value: true },
      ],
    },
  },
  defaultProps: {
    text: "",
    fullWidth: false,
  },
};
