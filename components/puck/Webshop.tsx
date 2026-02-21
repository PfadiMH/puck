import { ComponentConfig } from "@puckeditor/core";
import { WebshopClient } from "./WebshopClient";

export type WebshopSize = "gross" | "mittel" | "klein";

export type WebshopProps = {
  size: WebshopSize;
};

function Webshop({ size }: WebshopProps) {
  return <WebshopClient size={size} />;
}

export const webshopConfig: ComponentConfig<WebshopProps> = {
  label: "Webshop",
  render: Webshop,
  defaultProps: {
    size: "mittel",
  },
  fields: {
    size: {
      type: "select",
      label: "Produktgrösse",
      options: [
        { label: "Gross", value: "gross" },
        { label: "Mittel", value: "mittel" },
        { label: "Klein", value: "klein" },
      ],
    },
  },
};
