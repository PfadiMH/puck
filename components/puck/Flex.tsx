import { ComponentConfig, WithPuckProps } from "@measured/puck";

export type FlexProps = {
  items: object[];
  minItemWidth: number;
  gap: number;
};

function Flex({
  items,
  minItemWidth,
  gap,
  puck: { renderDropZone },
}: WithPuckProps<FlexProps>) {
  const DropZone = renderDropZone;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))`,
        gap: `${gap}px`,
      }}
    >
      {items.map((_, idx) => (
        <DropZone key={idx} zone={`item-${idx}`} />
      ))}
    </div>
  );
}

export const flexConfig: ComponentConfig<FlexProps> = {
  label: "Grid",
  render: Flex,
  fields: {
    items: {
      type: "array",
      arrayFields: {},
      getItemSummary: (_, id = -1) => `Item ${id + 1}`,
    },
    minItemWidth: {
      label: "Min Item Width (px)",
      type: "number",
      min: 100,
    },
    gap: {
      label: "Gap (px)",
      type: "number",
      min: 0,
    },
  },
  defaultProps: {
    items: [{}, {}, {}],
    minItemWidth: 200,
    gap: 20,
  },
};
