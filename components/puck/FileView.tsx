import { ComponentConfig } from "@measured/puck";
export type FileViewProps = {
  file: string[];
};

import { ColumnDef } from "@tanstack/react-table";
import { FileTable } from "./FileTable";
import { Textin } from "./Textout";

export const columns: ColumnDef<File>[] = [];

function FileView({ file }: FileViewProps) {
  return <Textin text={file} />;
  //return <div>{file}</div>;
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
