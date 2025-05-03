import { ComponentConfig } from "@measured/puck";
import { ColumnDef } from "@tanstack/react-table";

import { FileSaveProps, FileTable } from "@components/puck-fields/fileTable";
export type FileViewProps = {
  file: FileSaveProps[];
};

export const columns: ColumnDef<File>[] = [];

function FileView({ file }: FileViewProps) {
  return (
    <div>
      {file.map((single_file) => (
        <a key={single_file.name} href={single_file.url}>
          {single_file.name}
        </a>
      ))}
    </div>
  );
}

export const fileViewConfig: ComponentConfig<FileViewProps> = {
  render: FileView,
  fields: {
    file: {
      type: "custom",
      render: FileTable,
    },
  },
  defaultProps: {
    file: [],
  },
};
