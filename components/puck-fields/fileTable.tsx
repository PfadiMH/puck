"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@components/puck-fields/ui/Button";
import { Checkbox } from "@components/puck-fields/ui/Checkbox";
import { DataTable } from "@components/puck-fields/ui/DataTable";
import { Input } from "@components/puck-fields/ui/Input";
import { CustomFieldRenderProps } from "@lib/custom-field-types";
import {
  FileManagerService,
  getFileManagerService,
} from "@lib/filemanager/filemanager";
import { queryClient } from "@lib/query-client";
import { CustomField } from "@measured/puck";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import TrashCanSvg from "../graphics/TrashCanSvg";
import { RadioGroup, RadioGroupItem } from "./ui/RadioGroup";

export type FileProps = {
  name: string | null;
  url: string | null;
};

type FileTableProps<T> = CustomFieldRenderProps<T> & {
  isSingleSelection: boolean;
};

function FileTable<T extends FileProps | FileProps[]>({
  onChange,
  value,
  isSingleSelection,
}: FileTableProps<T>) {
  useEffect(() => {
    const fetchData = async () => {
      setFileManager(await getFileManagerService());
    };

    fetchData();
  }, []);

  const [fileManager, setFileManager] = useState<FileManagerService | null>(
    null
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["files"],
    queryFn: () => fileManager?.getFileNames() || [],
    enabled: !!fileManager,
  });
  const valueArray = Array.isArray(value) ? value : value ? [value] : [];

  const selection = valueArray.map((rowValue) =>
    String(data?.findIndex((dataValue) => dataValue === rowValue.name) ?? -1)
  );
  const onSelectionChange = async (selected: string[]) => {
    if (data && fileManager) {
      const selectedFilesPromises = selected.map(async (index) => {
        const name = data[Number(index)];
        const url = await fileManager.getFileUrl(name);
        return { name, url };
      });
      const selectedFiles = await Promise.all(selectedFilesPromises);
      onChange(
        isSingleSelection ? (selectedFiles[0] as T) : (selectedFiles as T)
      );
    }
  };

  const columns: ColumnDef<string>[] = [
    {
      id: "select",
      header: ({ table }) =>
        !isSingleSelection ? (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ) : null,
      cell: ({ row }) =>
        !isSingleSelection ? (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ) : (
          <RadioGroupItem value={row.index.toString()} />
        ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "filename",
      header: () => <div className="text-right">Filename</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium whitespace-normal break-words">
            {row.original}
          </div>
        );
      },
      filterFn: (row, _, filterValue) => {
        if (
          filterValue === undefined ||
          filterValue === null ||
          filterValue === ""
        ) {
          return true;
        }
        return row.original.toLowerCase().includes(filterValue.toLowerCase());
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const name = row.original;

        if (!name) {
          return null;
        }

        return (
          <Button
            variant="link"
            size="sm"
            onClick={async () => {
              await fileManager?.deleteFile(name);
              queryClient.invalidateQueries({
                queryKey: ["files"],
              });
            }}
          >
            <TrashCanSvg />
          </Button>
        );
      },
    },
  ];

  return isLoading || isFetching ? (
    <div>loading...</div>
  ) : (
    <div
      className="flex flex-col w-full h-full gap-4"
      onDrop={(event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
          Array.from(files).forEach(async (file: File) => {
            await fileManager?.saveFile(file);
          });
          queryClient.invalidateQueries({
            queryKey: ["files"],
          });
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
      }}
    >
      <Input
        type="file"
        onChange={(event) => {
          event.preventDefault();
          const files = event.target.files;
          if (files && files.length > 0) {
            Array.from(files).forEach(async (file: File) => {
              await fileManager?.saveFile(file);
              queryClient.invalidateQueries({
                queryKey: ["files"],
              });
            });
          }
        }}
      />
      <RadioGroup
        onValueChange={(value) => {
          onSelectionChange([value]);
        }}
        defaultValue={selection[0]}
      >
        <DataTable
          columns={columns}
          data={data || []}
          searchField="filename"
          selection={selection}
          onSelectionChange={onSelectionChange}
        />
      </RadioGroup>
    </div>
  );
}

function SingleSelectionFileTable({
  onChange,
  value,
  field,
  name,
  id,
}: CustomFieldRenderProps<FileProps>) {
  return FileTable<FileProps>({
    onChange,
    value,
    field,
    name,
    id,
    isSingleSelection: true,
  });
}

function MultipleSelectionFileTable({
  onChange,
  value,
  field,
  name,
  id,
}: CustomFieldRenderProps<FileProps[]>) {
  return FileTable<FileProps[]>({
    onChange,
    value,
    field,
    name,
    id,
    isSingleSelection: false,
  });
}

export const singleSelectionFileTableField: CustomField<FileProps> = {
  type: "custom",
  label: "Upload File",
  render: SingleSelectionFileTable,
};

export const multipleSelectionFileTableField: CustomField<FileProps[]> = {
  type: "custom",
  label: "Upload File",
  render: MultipleSelectionFileTable,
};
