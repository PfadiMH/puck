import React from "react";
import { ComponentConfig, DropZone } from "@measured/puck";

export type FlexProps = {
  items: { minItemWidth?: number }[];
  minItemWidth: number;
};

function Flex({ items, minItemWidth }: FlexProps) {
  return (
    <div>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex-item"
          style={{ minWidth: item.minItemWidth || minItemWidth }}
        >
          <DropZone zone={`item-${idx}`} />
        </div>
      ))}
    </div>
  );
}

export const flexConfig: ComponentConfig<FlexProps> = {
  render: Flex,
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
};
