"use client";

import { FilePickerModal } from "@components/file-manager/FilePickerModal";
import { CustomFieldRenderProps } from "@lib/custom-field-types";
import { CustomField } from "@puckeditor/core";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type FilePickerProps = string | undefined;

function FilePicker({
  id,
  onChange,
  value,
  readOnly,
}: CustomFieldRenderProps<FilePickerProps>) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (urls: string[] | string) => {
    const first = Array.isArray(urls) ? urls[0] : urls;
    onChange(first);
    setIsModalOpen(false);
  };

  const handleClear = () => {
    onChange(undefined);
  };

  const isImage = value?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || 
                  value?.includes("/images/");

  return (
    <>
      <div className="space-y-2" id={id}>
        {value ? (
          <div className="relative border rounded-lg overflow-hidden">
            {isImage ? (
              <div className="relative aspect-video bg-gray-100">
                <Image
                  src={value}
                  alt="Selected file"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 p-4 bg-gray-50">
                <ImageIcon className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600 truncate flex-1">
                  {value.split("/").pop()}
                </span>
              </div>
            )}

            {!readOnly && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div
            role="button"
            tabIndex={readOnly ? -1 : 0}
            aria-disabled={readOnly}
            className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${
              readOnly ? "opacity-50" : "cursor-pointer hover:border-gray-400"
            }`}
            onClick={() => !readOnly && setIsModalOpen(true)}
            onKeyDown={(e) => {
              if (!readOnly && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                setIsModalOpen(true);
              }
            }}
          >
            <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              {readOnly ? "No file selected" : "Click to select file"}
            </p>
          </div>
        )}

        {!readOnly && value && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-sm text-primary hover:underline"
          >
            Change file
          </button>
        )}
      </div>

      <FilePickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
}

export const filePickerField: CustomField<FilePickerProps> = {
  type: "custom",
  label: "File",
  render: FilePicker,
};
