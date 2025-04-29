"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import * as React from "react";

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
import { Input } from "@components/puck/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/puck/Table";
import { CustomFieldRenderProps } from "@lib/custom-field-types";
import { deleteFile, getFileNames, saveFile } from "@lib/db/asb/database";
import { useQuery } from "@tanstack/react-query";

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
                console.log(name);
                deleteFile(name);
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

export function DataTable({
  onChange,
  value,
}: CustomFieldRenderProps<string[]>) {
  const { data = [], status } = useQuery({
    queryKey: ["filenames"],
    queryFn: getFileNames,
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    () => {
      const selection: RowSelectionState = {};
      if (value && data.length > 0) {
        data.forEach((filename, index) => {
          if (value.includes(filename)) {
            selection[index] = true;
          }
        });
      }
      return selection;
    }
  );

  function selection(value: React.SetStateAction<RowSelectionState>) {
    const nextState = typeof value === "function" ? value(rowSelection) : value;
    setRowSelection(nextState);
    const selectedRowIds = Object.keys(nextState);
    let selectedFilenames: string[] = [];

    if (selectedRowIds.length > 0) {
      for (const rowId of selectedRowIds) {
        const row = table.getRow(rowId);
        if (row) {
          selectedFilenames.push(row.original);
        } else {
          console.warn(`Could not find row for ID: ${rowId}`);
        }
      }
    }

    onChange(selectedFilenames);
  }

  const table = useReactTable({
    data: data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: selection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div
      className="w-full h-full"
      onDrop={(event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
          Array.from(files).forEach((file: File) => {
            saveFile(file);
          });
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
      }}
    >
      <div className="flex items-center py-4 gap-4">
        <Input
          type="file"
          onChange={(event) => {
            event.preventDefault();
            const files = event.target.files;
            if (files && files.length > 0) {
              Array.from(files).forEach((file: File) => {
                saveFile(file);
              });
            }
          }}
        />
        <Input
          placeholder="Filter filenames..."
          value={
            (table.getColumn("filename")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("filename")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} file(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
