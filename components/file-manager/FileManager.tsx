"use client";

import type { FileWithUrl } from "@lib/files/file-actions";
import {
  useDeleteFile,
  useFilesInfinite,
  useFolders,
  useUploadFile,
} from "@lib/files/use-files";
import type { FileRecord } from "@lib/storage/file-record";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FileGrid } from "./FileGrid";
import { FileUploader } from "./FileUploader";

interface FileManagerProps {
  multiple?: boolean;
  onSelect?: (files: FileRecord[]) => void;
  initialSelectedIds?: string[];
  showUploader?: boolean;
  initialFolder?: string;
}

// Debounce hook for search input
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function FileManager({
  multiple = false,
  onSelect,
  initialSelectedIds = [],
  showUploader = true,
  initialFolder = "/",
}: FileManagerProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [currentFolder, setCurrentFolder] = useState<string>(initialFolder);
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce search to avoid excessive server requests
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  // Use server-side filtering with infinite scroll
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFilesInfinite({
    folder: currentFolder === "/" ? undefined : currentFolder,
    search: debouncedSearch || undefined,
  });

  const { data: folders = [], isLoading: foldersLoading } = useFolders();
  const uploadMutation = useUploadFile();
  const deleteMutation = useDeleteFile();

  // Flatten pages into single array
  const files = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.files);
  }, [data?.pages]);

  // Extract public URL from first file for fallback
  const publicUrl = useMemo(() => {
    if (files.length > 0 && files[0].url) {
      try {
        const url = new URL(files[0].url);
        return `${url.protocol}//${url.host}`;
      } catch {
        return "";
      }
    }
    return "";
  }, [files]);

  const handleUpload = useCallback(
    async (file: File) => {
      await uploadMutation.mutateAsync({
        file,
        folder: currentFolder !== "/" ? currentFolder : undefined,
      });
    },
    [uploadMutation, currentFolder]
  );

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        if (multiple) {
          return prev.includes(id)
            ? prev.filter((i) => i !== id)
            : [...prev, id];
        }
        return prev.includes(id) ? [] : [id];
      });
    },
    [multiple]
  );

  // Use ref to track files for selection lookup without re-triggering effect
  const filesRef = useRef(files);
  filesRef.current = files;

  // Notify parent when selection changes (only when selectedIds changes)
  useEffect(() => {
    if (onSelect) {
      const selectedFiles = filesRef.current.filter((f: FileWithUrl) =>
        selectedIds.includes(f._id)
      );
      onSelect(selectedFiles);
    }
  }, [selectedIds, onSelect]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this file?")) return;

      try {
        await deleteMutation.mutateAsync(id);
        setSelectedIds((prev) => prev.filter((i) => i !== id));
      } catch (err) {
        alert(err instanceof Error ? err.message : "Delete failed");
      }
    },
    [deleteMutation]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading files...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500">
          {error instanceof Error ? error.message : "Failed to load files"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and folder filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        {(folders.length > 1 || foldersLoading) && (
          <select
            value={currentFolder}
            onChange={(e) => setCurrentFolder(e.target.value)}
            disabled={foldersLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          >
            <option value="/">All Files</option>
            {folders
              .filter((f) => f !== "/")
              .map((folder) => (
                <option key={folder} value={folder}>
                  {folder}
                </option>
              ))}
          </select>
        )}
      </div>

      {showUploader && <FileUploader onUpload={handleUpload} />}

      {files.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {searchQuery || currentFolder !== "/"
            ? "No files match your search"
            : "No files uploaded yet"}
        </div>
      ) : (
        <>
          <FileGrid
            files={files}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onDelete={handleDelete}
            fallbackPublicUrl={publicUrl}
          />

          {/* Load more button for infinite scroll */}
          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isFetchingNextPage ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
