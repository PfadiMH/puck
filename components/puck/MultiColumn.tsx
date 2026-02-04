import { ComponentConfig, WithPuckProps } from "@puckeditor/core";

export type MultiColumnProps = {
  layout: number[];
  gap: string;
  stackOnMobile: boolean;
};

const DEFAULT_LAYOUT = [1, 1];

function MultiColumn({
  layout,
  gap,
  stackOnMobile,
  puck: { renderDropZone: DropZone },
}: WithPuckProps<MultiColumnProps>) {
  const columns = Array.isArray(layout) ? layout : DEFAULT_LAYOUT;
  const gridTemplateColumns = columns.map((ratio) => `${ratio}fr`).join(" ");

  return (
    <div
      className={stackOnMobile ? "multi-column-stack-mobile" : ""}
      style={{
        display: "grid",
        gridTemplateColumns,
        gap,
        alignItems: "start",
      }}
    >
      {columns.map((_, idx) => (
        <div key={idx} style={{ minWidth: 0, overflowWrap: "break-word", height: "fit-content" }}>
          <DropZone zone={`column-${idx}`} />
        </div>
      ))}
    </div>
  );
}

export const multiColumnConfig: ComponentConfig<MultiColumnProps> = {
  label: "Multi Column",
  render: MultiColumn,
  defaultProps: {
    layout: [1, 1],
    gap: "1rem",
    stackOnMobile: true,
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
    stackOnMobile: {
      type: "radio",
      label: "Stack on Mobile",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
  },
};
