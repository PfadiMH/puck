import { ComponentConfig, WithPuckProps } from "@puckeditor/core";

export type FooterColumnsProps = {
  columns: { id: string }[];
};

function FooterColumns({
  columns,
  puck: { renderDropZone, isEditing },
}: WithPuckProps<FooterColumnsProps>) {
  const DropZone = renderDropZone;

  const gridClass = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8";

  return (
    <div className={gridClass}>
      {columns.map((col, idx) => (
        <div
          key={col.id || idx}
          className={`flex flex-col ${isEditing ? "min-h-[100px] border border-dashed border-gray-400/50 rounded p-2" : ""}`}
        >
          <DropZone zone={`column-${idx}`} />
        </div>
      ))}
    </div>
  );
}

export const footerColumnsConfig: ComponentConfig<FooterColumnsProps> = {
  label: "Spalten",
  render: FooterColumns,
  fields: {
    columns: {
      type: "array",
      label: "Spalten",
      arrayFields: {
        id: {
          type: "text",
          label: "ID (intern)",
        },
      },
      getItemSummary: (_, id = -1) => `Spalte ${id + 1}`,
      defaultItemProps: {
        id: "",
      },
    },
  },
  defaultProps: {
    columns: [{ id: "1" }, { id: "2" }, { id: "3" }],
  },
};
