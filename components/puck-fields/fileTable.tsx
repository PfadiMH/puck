"use client";

import { ColumnDef } from "@tanstack/react-table";

import { queryClient } from "@components/Providers";
import { Button } from "@components/puck/Button";
import { Checkbox } from "@components/puck/Checkbox";
import { DataTable } from "@components/puck/DataTable";
import { Input } from "@components/puck/Input";
import { CustomFieldRenderProps } from "@lib/custom-field-types";
import {
  FileManagerService,
  getFileManagerService,
} from "@lib/filemanager/filemanager";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TrashCan } from "../../assets/TrashCan";

export type FileSaveProps = {
  name: string;
  url: string;
};

export function FileTable({
  onChange,
  value,
}: CustomFieldRenderProps<FileSaveProps[]>) {
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
  const selection = value.map((rowValue) =>
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
      onChange(selectedFiles);
    }
  };

  const columns: ColumnDef<string>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
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
            <TrashCan />
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
      <DataTable
        columns={columns}
        data={data || []}
        searchField="filename"
        selection={selection}
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
}
