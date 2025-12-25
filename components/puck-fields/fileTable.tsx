"use client";
import { Button } from "@components/puck-fields/ui/Button";
import { Checkbox } from "@components/puck-fields/ui/Checkbox";
import { DataTable } from "@components/puck-fields/ui/DataTable";
import { Input } from "@components/puck-fields/ui/Input";
import { toast } from "@components/ui/Toast";
import { CustomFieldRenderProps } from "@lib/custom-field-types";
import { AllMetadataProps, getAllMetadata } from "@lib/db/database";
import { queryClient } from "@lib/query-client";
import { deleteFile, saveFile } from "@lib/storage/storage";
import { CustomField } from "@measured/puck";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/RadioGroup";

type FileTableProps<T> = CustomFieldRenderProps<T> & {
  isSingleSelection: boolean;
};

function FileTable<T>({
  onChange,
  value,
  isSingleSelection,
}: FileTableProps<T>) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["files"],
    queryFn: async () => await getAllMetadata(),
  });

  const valueArray = Array.isArray(value) ? value : value ? [value] : [];

  const selection = valueArray.map((rowValue) =>
    String(data?.findIndex((dataValue) => dataValue.id === rowValue) ?? -1)
  );
  const onSelectionChange = async (selected: string[]) => {
    if (data != undefined) {
      const selectedData = selected
        .map((selectedIndex) => data[parseInt(selectedIndex, 10)])
        .filter(Boolean)
        .map((item) => item.id);

      onChange(
        isSingleSelection
          ? ((selectedData[0] || null) as T)
          : (selectedData as T)
      );
    }
  };

  const columns: ColumnDef<AllMetadataProps>[] = [
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
            {row.original.filename}
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
        return row.original.filename
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const id = row.original.id;

        if (!id) {
          return null;
        }

        return (
          <Button
            variant="link"
            size="sm"
            onClick={async () => {
              await deleteFile(id);
              queryClient.invalidateQueries({
                queryKey: ["files"],
              });
            }}
          >
            <Trash2 />
          </Button>
        );
      },
    },
  ];

  if (isLoading || isFetching || !data) {
    return <div>loading...</div>;
  }

  const handleFileUploads = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const uploadPromises = Array.from(files).map((file) => {
      if (file.size > 100 * 1024 * 1024) {
        toast("File is too large, it exceeded 100mb");
        return Promise.resolve();
      }
      return saveFile(file, "");
    });

    await Promise.all(uploadPromises);

    queryClient.invalidateQueries({
      queryKey: ["files"],
    });
  };

  return (
    <div
      className="flex flex-col w-full h-full gap-4"
      onDrop={(event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        handleFileUploads(files);
      }}
      onDragOver={(event) => {
        event.preventDefault();
      }}
    >
      <Input
        type="file"
        multiple
        onChange={(event) => {
          event.preventDefault();
          const files = event.target.files;
          handleFileUploads(files);
        }}
      />
      <RadioGroup
        onValueChange={(value) => {
          onSelectionChange([value]);
        }}
        defaultValue={selection[0]}
      >
        <DataTable<AllMetadataProps>
          columns={columns}
          data={data}
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
}: CustomFieldRenderProps<string>) {
  return FileTable<string>({
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
}: CustomFieldRenderProps<string[]>) {
  return FileTable<string[]>({
    onChange,
    value,
    field,
    name,
    id,
    isSingleSelection: false,
  });
}

export const singleSelectionFileTableField: CustomField<string> = {
  type: "custom",
  label: "Upload File",
  render: SingleSelectionFileTable,
};

export const multipleSelectionFileTableField: CustomField<string[]> = {
  type: "custom",
  label: "Upload File",
  render: MultipleSelectionFileTable,
};
