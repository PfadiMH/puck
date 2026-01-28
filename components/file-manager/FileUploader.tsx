"use client";

import { Upload } from "lucide-react";
import { useCallback, useState } from "react";

interface FileUploaderProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
}

export function FileUploader({
  onUpload,
  accept = "image/*,application/pdf",
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        await onUpload(file);
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
          : "border-gray-300 hover:border-gray-400"
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
        id="file-upload"
        accept={accept}
        onChange={handleChange}
        disabled={isUploading}
      />
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center cursor-pointer"
      >
        <Upload className="w-10 h-10 text-gray-400 mb-2" />
        {isUploading ? (
          <span className="text-gray-500">Uploading...</span>
        ) : (
          <>
            <span className="text-gray-600 font-medium">
              Drop file here or click to upload
            </span>
            <span className="text-gray-400 text-sm mt-1">
              Images (JPG, PNG, WebP, GIF, SVG) or PDF, max 10MB
            </span>
          </>
        )}
      </label>
    </div>
  );
}
