import { ComponentConfig, Slot, SlotComponent } from "@puckeditor/core";

export type MultiColumnProps = {
  layout: number[];
  gap: string;
  column0: Slot;
  column1: Slot;
  column2?: Slot;
  column3?: Slot;
};

const DEFAULT_LAYOUT = [1, 1];

const SLOT_NAMES = ["column0", "column1", "column2", "column3"] as const;

type MultiColumnRenderProps = {
  layout: number[];
  gap: string;
  column0: SlotComponent;
  column1: SlotComponent;
  column2?: SlotComponent;
  column3?: SlotComponent;
};

function MultiColumn(props: MultiColumnRenderProps) {
  const { layout, gap } = props;
  const columns = Array.isArray(layout) ? layout : DEFAULT_LAYOUT;
  const gridTemplateColumns = columns.map((ratio) => `${ratio}fr`).join(" ");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns,
        gap,
        alignItems: "start",
      }}
    >
      {columns.map((_, idx) => {
        const Column = props[SLOT_NAMES[idx]] as SlotComponent | undefined;
        if (!Column) return null;
        return (
          <div
            key={idx}
            style={{
              minWidth: 0,
              overflowWrap: "break-word",
              height: "fit-content",
            }}
          >
            <Column />
          </div>
        );
      })}
    </div>
  );
}

export const multiColumnConfig: ComponentConfig<MultiColumnProps> = {
  label: "Multi Column",
  render: MultiColumn,
  defaultProps: {
    layout: [1, 1],
    gap: "1rem",
    column0: [],
    column1: [],
  },
  fields: {
    layout: {
      type: "select",
      label: "Layout",
      options: [
        { label: "2 Columns - Equal", value: [1, 1] },
        { label: "2 Columns - Narrow | Wide", value: [1, 2] },
        { label: "2 Columns - Wide | Narrow", value: [2, 1] },
        { label: "2 Columns - Sidebar | Main", value: [1, 3] },
        { label: "2 Columns - Main | Sidebar", value: [3, 1] },
        { label: "3 Columns - Equal", value: [1, 1, 1] },
        { label: "3 Columns - Narrow | Wide | Narrow", value: [1, 2, 1] },
        { label: "3 Columns - Wide | Narrow | Narrow", value: [2, 1, 1] },
        { label: "3 Columns - Narrow | Narrow | Wide", value: [1, 1, 2] },
        { label: "4 Columns - Equal", value: [1, 1, 1, 1] },
      ],
    },
    gap: {
      type: "select",
      label: "Gap",
      options: [
        { label: "None", value: "0" },
        { label: "Small", value: "0.5rem" },
        { label: "Medium", value: "1rem" },
        { label: "Large", value: "2rem" },
      ],
    },
    column0: { type: "slot" },
    column1: { type: "slot" },
    column2: { type: "slot" },
    column3: { type: "slot" },
  },
};
