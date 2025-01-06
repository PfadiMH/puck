import React from "react";
import { ComponentConfig, DropZone } from "@measured/puck";
import getClassNameFactory from "../lib/get-class-name-factory";

const getClassName = getClassNameFactory("Flex");

export type FlexProps = {
  items: { minItemWidth?: number }[];
  minItemWidth: number;
};

export const flexConfig: ComponentConfig<FlexProps> = {
  fields: {
    items: {
      type: "array",
      arrayFields: {
        minItemWidth: {
          label: "Minimum Item Width",
          type: "number",
          min: 0,
        },
      },
      getItemSummary: (_, id = -1) => `Item ${id + 1}`,
    },
    minItemWidth: {
      label: "Minimum Item Width",
      type: "number",
      min: 0,
    },
  },
  defaultProps: {
    items: [{}, {}],
    minItemWidth: 356,
  },
  render: ({ items, minItemWidth }) => (
    <div>
      {items.map((item, idx) => (
        <div
          key={idx}
          className={getClassName("item")}
          style={{ minWidth: item.minItemWidth || minItemWidth }}
        >
          <DropZone zone={`item-${idx}`} />
        </div>
      ))}
    </div>
  ),
};
