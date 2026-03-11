"use client";

import { ACCEPT_STRING, ALLOWED_TYPES, MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from "@lib/files/constants";
import { Upload } from "lucide-react";
import { useCallback, useId, useState } from "react";

interface FileUploaderProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
}

export function FileUploader({
  onUpload,
  accept = ACCEPT_STRING,
}: FileUploaderProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert("Invalid file type. Allowed: images and PDFs.");
        return;
      }
      setIsUploading(true);
      try {
        await onUpload(file);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
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
      />
      <label
        htmlFor={inputId}
        className="flex flex-col items-center cursor-pointer"
      >
        <Upload className="w-10 h-10 text-contrast-ground/50 mb-2" />
        {isUploading ? (
          <span className="text-contrast-ground/50">Uploading...</span>
        ) : (
          <>
            <span className="text-contrast-ground/70 font-medium">
              Drop file here or click to upload
            </span>
            <span className="text-contrast-ground/50 text-sm mt-1">
              Images (JPG, PNG, WebP, GIF, SVG) or PDF, max {MAX_FILE_SIZE_MB}MB
            </span>
          </>
        )}
      </label>
    </div>
  );
}
