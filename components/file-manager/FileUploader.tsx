"use client";

import { ACCEPT_STRING, ALLOWED_TYPES, MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from "@lib/files/constants";
import { Upload } from "lucide-react";
import { useCallback, useId, useState } from "react";

interface FileUploaderProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  multiple?: boolean;
  allowFolders?: boolean;
}

export function FileUploader({
  onUpload,
  accept = ACCEPT_STRING,
  multiple = true,
  allowFolders = true,
}: FileUploaderProps) {
  const inputId = useId();
  const folderInputId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        return false;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(`Invalid file type for "${file.name}". Allowed: images, videos, PDFs, and ZIPs.`);
        return false;
      }
      try {
        await onUpload(file);
        return true;
      } catch (err) {
        alert(err instanceof Error ? err.message : `Upload failed for "${file.name}"`);
        return false;
      }
    },
    [onUpload]
  );

  const handleFiles = useCallback(
    async (files: FileList) => {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return;

      setIsUploading(true);
      setUploadProgress({ current: 0, total: fileArray.length });

      for (let i = 0; i < fileArray.length; i++) {
        setUploadProgress({ current: i + 1, total: fileArray.length });
        await handleFile(fileArray[i]);
      }

      setIsUploading(false);
      setUploadProgress(null);
    },
    [handleFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        if (multiple) {
          handleFiles(files);
        } else {
          handleFile(files[0]);
        }
      }
    },
    [handleFile, handleFiles, multiple]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        if (multiple) {
          handleFiles(files);
        } else {
          handleFile(files[0]);
        }
      }
      e.target.value = "";
    },
    [handleFile, handleFiles, multiple]
  );

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-contrast-ground/20 hover:border-contrast-ground/30"
      } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="hidden"
        id={inputId}
        accept={accept}
        onChange={handleChange}
        disabled={isUploading}
        multiple={multiple}
      />
      {allowFolders && (
        <input
          type="file"
          className="hidden"
          id={folderInputId}
          onChange={handleChange}
          disabled={isUploading}
          {...{ webkitdirectory: "", directory: "" } as React.InputHTMLAttributes<HTMLInputElement>}
        />
      )}
      <label
        htmlFor={inputId}
        className="flex flex-col items-center cursor-pointer"
      >
        <Upload className="w-10 h-10 text-contrast-ground/50 mb-2" />
        {isUploading && uploadProgress ? (
          <span className="text-contrast-ground/50">
            Uploading {uploadProgress.current} of {uploadProgress.total}...
          </span>
        ) : (
          <>
            <span className="text-contrast-ground/70 font-medium">
              Drop {multiple ? "files" : "file"} here or click to upload
            </span>
            <span className="text-contrast-ground/50 text-sm mt-1">
              Images, Videos, PDF or ZIP (max {MAX_FILE_SIZE_MB}MB per file)
            </span>
            {allowFolders && (
              <label
                htmlFor={folderInputId}
                className="text-primary text-sm mt-2 cursor-pointer hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                or upload a folder
              </label>
            )}
          </>
        )}
      </label>
    </div>
  );
}
