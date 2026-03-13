"use client";

import Button from "@components/ui/Button";
import type { FileRecord } from "@lib/storage/file-record";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FileManager } from "./FileManager";

interface FilePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (urls: string[] | string) => void;
  multiple?: boolean;
}

export function FilePickerModal({
  isOpen,
  onClose,
  onSelect,
  multiple = false,
}: FilePickerModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileRecord[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedFiles([]);
    }
  }, [isOpen]);

  const handleSelect = useCallback((files: FileRecord[]) => {
    setSelectedFiles(files);
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedFiles.length > 0) {
      if (multiple) {
        const urls = selectedFiles.map((f) => f.url || f.s3Key);
        onSelect(urls);
      } else {
        const file = selectedFiles[0];
        onSelect(file.url || file.s3Key);
      }
      onClose();
    }
  }, [selectedFiles, onSelect, onClose, multiple]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] bg-elevated rounded-lg shadow-xl w-[90vw] max-w-4xl max-h-[80vh] flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <Dialog.Title className="text-lg font-semibold">Select File</Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label="Close modal"
                className="p-1 hover:bg-elevated rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <FileManager
              multiple={multiple}
              onSelect={handleSelect}
              showUploader={true}
            />
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
            <Dialog.Close asChild>
              <Button color="secondary">
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              onClick={handleConfirm}
              color="primary"
              disabled={selectedFiles.length === 0}
            >
              Select ({selectedFiles.length})
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
