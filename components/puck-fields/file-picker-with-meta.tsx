"use client";

import { FilePickerModal } from "@components/file-manager/FilePickerModal";
import { CustomFieldRenderProps } from "@lib/custom-field-types";
import type { FileRecord, FileSelection } from "@lib/storage/file-record";
import { CustomField } from "@measured/puck";
import { FileIcon, ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type FilePickerValue = FileSelection | null | undefined;

function FilePickerWithMeta({
  id,
  onChange,
  value,
  readOnly,
}: CustomFieldRenderProps<FilePickerValue>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (files: FileRecord[]) => {
    if (files.length > 0) {
      const file = files[0];
      
      // Guard against missing URL
      if (!file.url) {
        setError("Selected file has no valid URL");
        return;
      }
      
      setError(null);
      const selection: FileSelection = {
        url: file.url,
        size: file.size,
        filename: file.filename,
        contentType: file.contentType,
        blurhash: file.blurhash,
        width: file.width,
        height: file.height,
      };
      onChange(selection);
      setIsModalOpen(false);
    }
  };

  const handleClear = () => {
    onChange(null);
  };

  const isImage = value?.contentType?.startsWith("image/");

  return (
    <>
      <div className="space-y-2" id={id}>
        {value ? (
          <div className="relative border rounded-lg overflow-hidden">
            {isImage ? (
              <div className="relative aspect-video bg-gray-100">
                <Image
                  src={value.url}
                  alt={value.filename}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-gray-50">
                <FileIcon className="w-8 h-8 text-gray-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {value.filename}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(value.size)}
                  </p>
                </div>
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

            {isImage && (
              <div className="px-3 py-2 bg-gray-50 border-t text-xs text-gray-500">
                {value.filename} ({formatFileSize(value.size)})
                {value.width && value.height && (
                  <span className="ml-2">
                    {value.width} x {value.height}
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div
            className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${
              readOnly ? "opacity-50" : "cursor-pointer hover:border-gray-400"
            }`}
            onClick={() => !readOnly && setIsModalOpen(true)}
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
        
        {error && (
          <p className="text-sm text-red-500">{error}</p>
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

export const filePickerWithMetaField: CustomField<FilePickerValue> = {
  type: "custom",
  label: "File",
  render: FilePickerWithMeta,
};
