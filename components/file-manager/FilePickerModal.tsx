"use client";

import Button from "@components/ui/Button";
import type { FileRecord } from "@lib/storage/file-record";
import { X } from "lucide-react";
import { useCallback, useState } from "react";
import { FileManager } from "./FileManager";

interface FilePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  multiple?: boolean;
}

export function FilePickerModal({
  isOpen,
  onClose,
  onSelect,
  multiple = false,
}: FilePickerModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileRecord[]>([]);

  const handleSelect = useCallback((files: FileRecord[]) => {
    setSelectedFiles(files);
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedFiles.length > 0) {
      const file = selectedFiles[0];
      const url = file.url || file.s3Key;
      onSelect(url);
      onClose();
    }
  }, [selectedFiles, onSelect, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Select File</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <FileManager
            multiple={multiple}
            onSelect={handleSelect}
            showUploader={true}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            color="primary"
            disabled={selectedFiles.length === 0}
          >
            Select ({selectedFiles.length})
          </Button>
        </div>
      </div>
    </div>
  );
}
