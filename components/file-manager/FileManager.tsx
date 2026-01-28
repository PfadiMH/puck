"use client";

import type { FileRecord } from "@lib/storage/file-record";
import { useCallback, useEffect, useState } from "react";
import { FileGrid } from "./FileGrid";
import { FileUploader } from "./FileUploader";

type FileItem = FileRecord & { url?: string };

interface FileManagerProps {
  multiple?: boolean;
  onSelect?: (files: FileRecord[]) => void;
  initialSelectedIds?: string[];
  showUploader?: boolean;
}

export function FileManager({
  multiple = false,
  onSelect,
  initialSelectedIds = [],
  showUploader = true,
}: FileManagerProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publicUrl, setPublicUrl] = useState("");

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch("/api/files");
      if (!res.ok) throw new Error("Failed to fetch files");
      const data: FileItem[] = await res.json();
      setFiles(data);
      // Extract public URL from first file if available
      if (data.length > 0 && data[0].url) {
        const url = new URL(data[0].url);
        setPublicUrl(`${url.protocol}//${url.host}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load files");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUpload = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      await fetchFiles();
    },
    [fetchFiles]
  );

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        let next: string[];
        if (multiple) {
          next = prev.includes(id)
            ? prev.filter((i) => i !== id)
            : [...prev, id];
        } else {
          next = prev.includes(id) ? [] : [id];
        }

        // Notify parent of selection
        if (onSelect) {
          const selectedFiles = files.filter((f) => next.includes(f._id));
          onSelect(selectedFiles);
        }

        return next;
      });
    },
    [multiple, onSelect, files]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this file?")) return;

      const res = await fetch(`/api/files/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Delete failed");
        return;
      }

      setSelectedIds((prev) => prev.filter((i) => i !== id));
      await fetchFiles();
    },
    [fetchFiles]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading files...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showUploader && <FileUploader onUpload={handleUpload} />}

      {files.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No files uploaded yet
        </div>
      ) : (
        <FileGrid
          files={files}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onDelete={handleDelete}
          fallbackPublicUrl={publicUrl}
        />
      )}
    </div>
  );
}
