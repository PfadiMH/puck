"use client";

import { FilePickerModal } from "@components/file-manager/FilePickerModal";
import { CustomFieldRenderProps } from "@lib/custom-field-types";
import { ALLOWED_TYPES, MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from "@lib/files/constants";
import { uploadFile } from "@lib/files/file-actions";
import { CustomField } from "@puckeditor/core";
import { ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

async function uploadAndGetUrl(file: File): Promise<string | null> {
  if (file.size > MAX_FILE_SIZE) {
    alert(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
    return null;
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    alert(`Invalid file type. Allowed: images, videos, PDFs, and ZIPs.`);
    return null;
  }
  const formData = new FormData();
  formData.append("file", file);
  const result = await uploadFile(formData);
  if (!result.success) {
    alert(result.error || "Upload failed");
    return null;
  }
  return result.data.url || result.data.s3Key;
}

type FilePickerProps = string | undefined;

function FilePicker({
  id,
  onChange,
  value,
  readOnly,
}: CustomFieldRenderProps<FilePickerProps>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleSelect = (urls: string[] | string) => {
    const first = Array.isArray(urls) ? urls[0] : urls;
    onChange(first);
    setIsModalOpen(false);
  };

  const handleClear = () => {
    onChange(undefined);
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (readOnly) return;

      const file = e.dataTransfer.files[0];
      if (!file) return;

      setIsUploading(true);
      const url = await uploadAndGetUrl(file);
      setIsUploading(false);

      if (url) {
        onChange(url);
      }
    },
    [onChange, readOnly]
  );

  const isImage = value?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || 
                  value?.includes("/images/");

  return (
    <>
      <div className="space-y-2" id={id}>
        {value ? (
          <div
            className={`relative border rounded-lg overflow-hidden ${
              isDragging ? "border-primary border-2" : ""
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              if (!readOnly) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
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

            {isDragging && (
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                <p className="text-primary font-medium">Drop to replace</p>
              </div>
            )}

            {!readOnly && !isDragging && (
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
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-gray-400"
            } ${readOnly ? "opacity-50" : "cursor-pointer"} ${
              isUploading ? "opacity-50 pointer-events-none" : ""
            }`}
            onClick={() => !readOnly && !isUploading && setIsModalOpen(true)}
            onKeyDown={(e) => {
              if (!readOnly && !isUploading && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                setIsModalOpen(true);
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (!readOnly) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-10 h-10 text-primary mx-auto mb-2 animate-spin" />
                <p className="text-sm text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {readOnly ? "No file selected" : "Click or drop file here"}
                </p>
              </>
            )}
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

type MultiFilePickerProps = string[] | undefined;

function MultiFilePicker({
  id,
  onChange,
  value,
  readOnly,
}: CustomFieldRenderProps<MultiFilePickerProps>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);

  const files = useMemo(() => value || [], [value]);

  const handleSelect = useCallback((urls: string[] | string) => {
    const urlArray = Array.isArray(urls) ? urls : [urls];
    onChange([...files, ...urlArray]);
    setIsModalOpen(false);
  }, [files, onChange]);

  const handleRemove = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles.length > 0 ? newFiles : undefined);
  }, [files, onChange]);

  const handleClearAll = useCallback(() => {
    onChange(undefined);
  }, [onChange]);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (readOnly) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length === 0) return;

      setIsUploading(true);
      setUploadProgress({ current: 0, total: droppedFiles.length });

      const newUrls: string[] = [];
      for (let i = 0; i < droppedFiles.length; i++) {
        setUploadProgress({ current: i + 1, total: droppedFiles.length });
        const url = await uploadAndGetUrl(droppedFiles[i]);
        if (url) {
          newUrls.push(url);
        }
      }

      setIsUploading(false);
      setUploadProgress(null);

      if (newUrls.length > 0) {
        onChange([...files, ...newUrls]);
      }
    },
    [onChange, readOnly, files]
  );

  const isImage = (url: string) =>
    url?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || url?.includes("/images/");

  return (
    <>
      <div
        className="space-y-2"
        id={id}
        onDragOver={(e) => {
          e.preventDefault();
          if (!readOnly) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {files.length > 0 ? (
          <>
            <div
              className={`grid grid-cols-3 gap-2 p-2 rounded-lg transition-colors ${
                isDragging ? "bg-primary/5 ring-2 ring-primary ring-dashed" : ""
              }`}
            >
              {files.map((file, index) => (
                <div
                  key={`${file}-${index}`}
                  className="relative border rounded-lg overflow-hidden group"
                >
                  {isImage(file) ? (
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={file}
                        alt={`Selected file ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center aspect-square bg-gray-50">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}

                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}

              {isUploading && uploadProgress && (
                <div className="flex items-center justify-center aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-primary">
                  <div className="text-center">
                    <Loader2 className="w-6 h-6 text-primary mx-auto animate-spin" />
                    <p className="text-xs text-gray-500 mt-1">
                      {uploadProgress.current}/{uploadProgress.total}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {isDragging && (
              <p className="text-sm text-primary text-center">Drop to add more files</p>
            )}

            {!readOnly && !isDragging && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Add more files
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove all
                </button>
              </div>
            )}
          </>
        ) : (
          <div
            role="button"
            tabIndex={readOnly ? -1 : 0}
            aria-disabled={readOnly}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-gray-400"
            } ${readOnly ? "opacity-50" : "cursor-pointer"} ${
              isUploading ? "opacity-50 pointer-events-none" : ""
            }`}
            onClick={() => !readOnly && !isUploading && setIsModalOpen(true)}
            onKeyDown={(e) => {
              if (!readOnly && !isUploading && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                setIsModalOpen(true);
              }
            }}
          >
            {isUploading && uploadProgress ? (
              <>
                <Loader2 className="w-10 h-10 text-primary mx-auto mb-2 animate-spin" />
                <p className="text-sm text-gray-600">
                  Uploading {uploadProgress.current} of {uploadProgress.total}...
                </p>
              </>
            ) : (
              <>
                <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {readOnly ? "No files selected" : "Click or drop files here"}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <FilePickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelect}
        multiple={true}
      />
    </>
  );
}

export const multiFilePickerField: CustomField<MultiFilePickerProps> = {
  type: "custom",
  label: "Files",
  render: MultiFilePicker,
};
