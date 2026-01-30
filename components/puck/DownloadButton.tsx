import { filePickerWithMetaField } from "@components/puck-fields/file-picker-with-meta";
import type { FileSelection } from "@lib/storage/file-record";
import { ComponentConfig } from "@measured/puck";
import { Download } from "lucide-react";

export type DownloadButtonProps = {
  file?: FileSelection | null;
  label: string;
  showFileSize: boolean;
  showIcon: boolean;
  fullWidth: boolean;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DownloadButton({
  file,
  label,
  showFileSize,
  showIcon,
  fullWidth,
}: DownloadButtonProps) {
  if (!file) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
        <p>No file selected</p>
      </div>
    );
  }

  const sizeText = showFileSize ? ` (${formatFileSize(file.size)})` : "";

  return (
    <a
      href={file.url}
      download={file.filename}
      className={`
        inline-flex items-center justify-center gap-2
        px-6 py-3 rounded-lg
        bg-primary text-contrast-primary
        hover:opacity-90 transition-opacity
        font-medium
        ${fullWidth ? "w-full" : ""}
      `}
    >
      {showIcon && <Download className="w-5 h-5" />}
      <span>
        {label}
        {sizeText}
      </span>
    </a>
  );
}

export const downloadButtonConfig: ComponentConfig<DownloadButtonProps> = {
  label: "Download Button",
  render: DownloadButton,
  fields: {
    file: {
      ...filePickerWithMetaField,
      label: "File",
    },
    label: {
      type: "text",
      label: "Button Text",
    },
    showFileSize: {
      type: "radio",
      label: "Show File Size",
      options: [
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
    },
    showIcon: {
      type: "radio",
      label: "Show Download Icon",
      options: [
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
    },
    fullWidth: {
      type: "radio",
      label: "Full Width",
      options: [
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
    },
  },
  defaultProps: {
    file: null,
    label: "Download",
    showFileSize: true,
    showIcon: true,
    fullWidth: false,
  },
};
