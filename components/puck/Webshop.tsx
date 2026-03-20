import { ComponentConfig } from "@puckeditor/core";
import { productSelectorField } from "@components/puck-fields/product-selector";
import { WebshopClient } from "./WebshopClient";

export type WebshopSize = "gross" | "mittel" | "klein";

export type WebshopProps = {
  size: WebshopSize;
  selectedProducts?: string[];
};

function Webshop({ size, selectedProducts }: WebshopProps) {
  return <WebshopClient size={size} selectedProducts={selectedProducts} />;
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
      label: "Product Size",
      options: [
        { label: "Large", value: "gross" },
        { label: "Medium", value: "mittel" },
        { label: "Small", value: "klein" },
      ],
    },
    selectedProducts: productSelectorField,
  },
};
