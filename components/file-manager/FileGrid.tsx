"use client";

import type { FileRecord } from "@lib/storage/file-record";
import { decode } from "blurhash";
import { FileText, Trash2 } from "lucide-react";
import Image from "next/image";


interface FileGridProps {
  files: FileRecord[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  fallbackPublicUrl?: string;
}

// Cache for decoded blurhash data URLs
const blurhashCache = new Map<string, string>();

function blurhashToDataURL(blurhash: string, width = 32, height = 32): string {
  const cacheKey = `${blurhash}-${width}-${height}`;
  const cached = blurhashCache.get(cacheKey);
  if (cached) return cached;

  try {
    const pixels = decode(blurhash, width, height);

    // Create canvas to convert pixel data to data URL
    if (typeof document === "undefined") {
      // SSR fallback - return gray placeholder
      return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23888'/%3E%3C/svg%3E`;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);

    const dataURL = canvas.toDataURL();
    blurhashCache.set(cacheKey, dataURL);
    return dataURL;
  } catch {
    // Fallback to gray placeholder on error
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23888'/%3E%3C/svg%3E`;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileGrid({
  files,
  selectedIds,
  onSelect,
  onDelete,
  fallbackPublicUrl = "",
}: FileGridProps) {
  const isImage = (contentType: string) => contentType.startsWith("image/");

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {files.map((file) => {
        const isSelected = selectedIds.includes(file._id);
        const url = file.url ||
          (fallbackPublicUrl ? `${fallbackPublicUrl}/${file.s3Key}` : `/${file.s3Key}`);

        return (
          <div
            key={file._id}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(file._id);
              }
            }}
            className={`relative group rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
              isSelected
                ? "border-primary ring-2 ring-primary/50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onSelect(file._id)}
          >
            {/* Preview */}
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              {isImage(file.contentType) ? (
                <Image
                  src={url}
                  alt={file.filename}
                  fill
                  className="object-cover"
                  placeholder={file.blurhash ? "blur" : "empty"}
                  blurDataURL={
                    file.blurhash ? blurhashToDataURL(file.blurhash) : undefined
                  }
                />
              ) : (
                <FileText className="w-12 h-12 text-gray-400" />
              )}
            </div>

            {/* Filename */}
            <div className="p-2 bg-white">
              <p className="text-xs truncate text-gray-700">{file.filename}</p>
              <p className="text-xs text-gray-400">
                {formatFileSize(file.size)}
              </p>
            </div>

            {/* Delete button */}
            <button
              aria-label={`Delete ${file.filename}`}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(file._id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Selected checkmark */}
            {isSelected && (
              <div className="absolute top-2 left-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
