import { filePickerField } from "@components/puck-fields/file-picker";
import type { ComponentConfig } from "@puckeditor/core";

export type DownloadButtonProps = {
  file?: string;
  label: string;
  variant: "primary" | "outlined";
};

const variantClasses: Record<DownloadButtonProps["variant"], string> = {
  primary:
    "bg-primary text-contrast-primary hover:opacity-90 px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2",
  outlined:
    "border-2 border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2",
};

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function extractFilename(url: string): string {
  try {
    const path = new URL(url).pathname;
    return path.split("/").pop() || "";
  } catch {
    return url.split("/").pop() || "";
  }
}

function DownloadButton({ file, label, variant }: DownloadButtonProps) {
  if (!file) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
        Keine Datei ausgewählt
      </div>
    );
  }

  return (
    <a
      href={file}
      download={extractFilename(file)}
      target="_blank"
      rel="noopener noreferrer"
      className={variantClasses[variant]}
    >
      <DownloadIcon />
      {label}
    </a>
  );
}

export const downloadButtonConfig: ComponentConfig<DownloadButtonProps> = {
  label: "Download-Button",
  render: DownloadButton,
  fields: {
    file: {
      ...filePickerField,
      label: "Datei",
    },
    label: {
      type: "text",
      label: "Button-Text",
    },
    variant: {
      type: "select",
      label: "Variante",
      options: [
        { label: "Primär", value: "primary" },
        { label: "Umrandet", value: "outlined" },
      ],
    },
  },
  defaultProps: {
    file: "",
    label: "Herunterladen",
    variant: "primary",
  },
};
