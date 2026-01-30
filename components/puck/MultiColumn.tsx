import { ComponentConfig, WithPuckProps } from "@measured/puck";

export type LayoutPreset =
  | "50 / 50"
  | "33 / 67"
  | "67 / 33"
  | "25 / 75"
  | "75 / 25"
  | "33 / 33 / 33"
  | "25 / 50 / 25"
  | "50 / 25 / 25"
  | "25 / 25 / 50"
  | "25 / 25 / 25 / 25";

export type MultiColumnProps = {
  layout: LayoutPreset;
  gap: "none" | "small" | "medium" | "large";
  stackOnMobile: boolean;
};

const layoutPresets: Record<LayoutPreset, number[]> = {
  "50 / 50": [1, 1],
  "33 / 67": [1, 2],
  "67 / 33": [2, 1],
  "25 / 75": [1, 3],
  "75 / 25": [3, 1],
  "33 / 33 / 33": [1, 1, 1],
  "25 / 50 / 25": [1, 2, 1],
  "50 / 25 / 25": [2, 1, 1],
  "25 / 25 / 50": [1, 1, 2],
  "25 / 25 / 25 / 25": [1, 1, 1, 1],
};

const gapValues = {
  none: "0",
  small: "0.5rem",
  medium: "1rem",
  large: "2rem",
};

function MultiColumn({
  layout,
  gap,
  stackOnMobile,
  puck: { renderDropZone: DropZone },
}: WithPuckProps<MultiColumnProps>) {
  const columns = layoutPresets[layout] ?? layoutPresets["50 / 50"];
  const gridTemplateColumns = columns.map((ratio) => `${ratio}fr`).join(" ");

  return (
    <div
      className={stackOnMobile ? "multi-column-stack-mobile" : ""}
      style={{
        display: "grid",
        gridTemplateColumns,
        gap: gapValues[gap],
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
    layout: "50 / 50",
    gap: "medium",
    stackOnMobile: true,
  },
  fields: {
    layout: {
      type: "select",
      label: "Layout",
      options: [
        { label: "2 Columns - Equal", value: "50 / 50" },
        { label: "2 Columns - Narrow | Wide", value: "33 / 67" },
        { label: "2 Columns - Wide | Narrow", value: "67 / 33" },
        { label: "2 Columns - Sidebar | Main", value: "25 / 75" },
        { label: "2 Columns - Main | Sidebar", value: "75 / 25" },
        { label: "3 Columns - Equal", value: "33 / 33 / 33" },
        { label: "3 Columns - Narrow | Wide | Narrow", value: "25 / 50 / 25" },
        { label: "3 Columns - Wide | Narrow | Narrow", value: "50 / 25 / 25" },
        { label: "3 Columns - Narrow | Narrow | Wide", value: "25 / 25 / 50" },
        { label: "4 Columns - Equal", value: "25 / 25 / 25 / 25" },
      ],
    },
    gap: {
      type: "select",
      label: "Gap",
      options: [
        { label: "None", value: "none" },
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
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
