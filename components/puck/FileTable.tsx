"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { queryClient } from "@components/Providers";
import { Button } from "@components/puck/Button";
import { Checkbox } from "@components/puck/Checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/puck/Dropdown";
import { CustomFieldRenderProps } from "@lib/custom-field-types";
import { deleteFile, getFileNames, saveFile } from "@lib/db/asb/database";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./DataTable";
import { Input } from "./Input";

export const columns: ColumnDef<string>[] = [
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
      return <div className="text-right font-medium">{row.original}</div>;
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View File</DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                deleteFile(name);
                queryClient.invalidateQueries({
                  queryKey: ["files"],
                });
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function FileTable({
  onChange,
  value,
}: CustomFieldRenderProps<string[]>) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["files"],
    queryFn: getFileNames,
  });
  const selection = value.map((rowValue) =>
    String(data?.findIndex((dataValue) => dataValue === rowValue) ?? -1)
  );
  const onSelectionChange = (selected: string[]) => {
    if (data) {
      const selectedFiles = selected.map((index) => data[Number(index)]);
      onChange(selectedFiles);
    }
  };

  return isLoading || isFetching ? (
    <div>loading...</div>
  ) : (
    <div
      className="w-full h-full"
      onDrop={(event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
          Array.from(files).forEach((file: File) => {
            saveFile(file);
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
            Array.from(files).forEach((file: File) => {
              saveFile(file);
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
