"use client";

import type { FileWithUrl } from "@lib/files/file-actions";
import {
  useDeleteFile,
  useFilesInfinite,
  useFolders,
  useUploadFile,
} from "@lib/files/use-files";
import type { FileRecord } from "@lib/storage/file-record";
import { Trash2 } from "lucide-react";
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

  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} selected file(s)?`)) return;

    try {
      for (const id of selectedIds) {
        await deleteMutation.mutateAsync(id);
      }
      setSelectedIds([]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Bulk delete failed");
    }
  }, [selectedIds, deleteMutation]);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.length === files.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(files.map((f) => f._id));
    }
  }, [selectedIds.length, files]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-contrast-ground/50">Loading files...</div>
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
          className="flex-1 px-4 py-2 border border-contrast-ground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        {(folders.length > 1 || foldersLoading) && (
          <select
            value={currentFolder}
            onChange={(e) => setCurrentFolder(e.target.value)}
            disabled={foldersLoading}
            className="px-4 py-2 border border-contrast-ground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
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

      {showUploader && <FileUploader onUpload={handleUpload} multiple={true} />}

      {files.length > 0 && (
        <div className="flex items-center justify-between gap-4 py-2 px-3 bg-ground rounded-lg">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={selectedIds.length === files.length && files.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-contrast-ground/30"
              />
              <span className="text-contrast-ground/70">
                {selectedIds.length > 0
                  ? `${selectedIds.length} selected`
                  : "Select all"}
              </span>
            </label>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedIds.length})
              </button>
            </div>
          )}
        </div>
      )}

      {files.length === 0 ? (
        <div className="text-center py-12 text-contrast-ground/50">
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
                className="px-6 py-2 bg-ground hover:bg-elevated rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
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
