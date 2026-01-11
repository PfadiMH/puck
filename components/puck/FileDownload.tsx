import { multipleSelectionFileTableField } from "@components/puck-fields/fileTable";
import { FileProps, getFile } from "@lib/storage/storage";
import { ComponentConfig } from "@measured/puck";
import { useQuery } from "@tanstack/react-query";

import {
  ArrowDownToLine,
  FileArchive,
  FileAudio,
  FileCode,
  FileDigit,
  FileImage,
  FileQuestion,
  FileSpreadsheet,
  FileType,
  FileVideo,
} from "lucide-react";

export type FileDownloadProps = {
  fileData: FileProps[];
};

export type FileDownloadWrapperProps = {
  fileIds: string[];
};

export async function FileDownloadServerWrapper({
  fileIds,
}: FileDownloadWrapperProps) {
  let fileData: FileProps[] = [];

  if (!fileIds || fileIds.length === 0) {
    return <div>No file selected.</div>;
  }

  for (const fileId of fileIds) {
    try {
      fileData.push(await getFile(fileId));
    } catch (error) {
      console.error(`Failed to retrieve file data for ID: ${fileId}`, error);
    }
  }

  if (fileData.length === 0) {
    console.warn(`No file data could be retrieved for IDs: ${fileIds}`);
    return <div>File not available.</div>;
  }

  return <FileDownload fileData={fileData} />;
}

export function FileDownloadClientWrapper({
  fileIds,
}: FileDownloadWrapperProps) {
  const {
    data: fileData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["files", fileIds],
    queryFn: () => Promise.all(fileIds.map((id) => getFile(id))),
    enabled: !!fileIds && fileIds.length > 0,
  });

  if (isLoading) {
    return <div>Loading file(s)...</div>;
  }

  if (isError) {
    console.error(`Failed to retrieve file data for IDs: ${fileIds}`);
    return <div>Error loading file(s).</div>;
  }

  if (!fileData || fileData.length === 0) {
    return <div>File(s) not available.</div>;
  }
  return <FileDownload fileData={fileData} />;
}
function FileDownload({ fileData }: FileDownloadProps) {
  const iconMap: { [key: string]: React.ReactNode } = {
    // Images
    jpg: <FileImage className="h-8 w-8" />,
    jpeg: <FileImage className="h-8 w-8" />,
    png: <FileImage className="h-8 w-8" />,
    gif: <FileImage className="h-8 w-8" />,
    svg: <FileImage className="h-8 w-8" />,
    webp: <FileImage className="h-8 w-8" />,
    "svg+xml": <FileImage className="h-8 w-8" />,
    // Audio
    mp3: <FileAudio className="h-8 w-8" />,
    wav: <FileAudio className="h-8 w-8" />,
    ogg: <FileAudio className="h-8 w-8" />,
    // Video
    mp4: <FileVideo className="h-8 w-8" />,
    webm: <FileVideo className="h-8 w-8" />,
    mov: <FileVideo className="h-8 w-8" />,
    // Documents
    pdf: <FileType className="h-8 w-8" />,
    doc: <FileType className="h-8 w-8" />,
    docx: <FileType className="h-8 w-8" />,
    psd: <FileType className="h-8 w-8" />,
    xls: <FileSpreadsheet className="h-8 w-8" />,
    xlsx: <FileSpreadsheet className="h-8 w-8" />,
    csv: <FileSpreadsheet className="h-8 w-8" />,
    // Archives
    zip: <FileArchive className="h-8 w-8" />,
    rar: <FileArchive className="h-8 w-8" />,
    "7z": <FileArchive className="h-8 w-8" />,
    // Code
    js: <FileCode className="h-8 w-8" />,
    ts: <FileCode className="h-8 w-8" />,
    tsx: <FileCode className="h-8 w-8" />,
    jsx: <FileCode className="h-8 w-8" />,
    json: <FileCode className="h-8 w-8" />,
    html: <FileCode className="h-8 w-8" />,
    css: <FileCode className="h-8 w-8" />,
    // binary
    bin: <FileDigit className="h-8 w-8" />,
    exe: <FileDigit className="h-8 w-8" />,
  };

  const getFileIcon = (contentType?: string) => {
    if (!contentType) {
      return <FileQuestion className="h-8 w-8" />;
    }
    return (
      iconMap[contentType.toLowerCase()] || <FileQuestion className="h-8 w-8" />
    );
  };

  return (
    <div className="flex w-full flex-wrap justify-center gap-2">
      {fileData.map((file, i) => (
        <a
          key={i}
          href={file.url}
          download={file.filename}
          className="flex w-80 items-center gap-4 rounded-lg bg-primary p-2 text-contrast-primary transition-colors"
        >
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-elevated text-contrast-ground">
            {getFileIcon(file.contentType?.split("/").pop())}
          </div>
          <div className="flex flex-col overflow-hidden">
            <div className="line-clamp-2 break-words font-semibold">
              {file.filename}
            </div>
            <div className="flex items-center gap-2 text-xs opacity-80">
              {file.contentType && (
                <span className="truncate">
                  {file.contentType.split("/").pop()?.toUpperCase()}
                </span>
              )}
              <span className="opacity-50">|</span>
              <span>
                {new Intl.NumberFormat(undefined, {
                  style: "unit",
                  unit: "byte",
                  unitDisplay: "narrow",
                  notation: "compact",
                }).format(file.size)}
              </span>
            </div>
          </div>
          <div className="ml-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-elevated text-contrast-ground">
            <ArrowDownToLine className="h-6 w-6" />
          </div>
        </a>
      ))}
    </div>
  );
}

export const fileDowloadPageConfig: ComponentConfig<FileDownloadWrapperProps> =
  {
    render: ({ fileIds }) => <FileDownloadServerWrapper fileIds={fileIds} />,
    fields: {
      fileIds: multipleSelectionFileTableField,
    },
  };

export const fileDowloadEditorConfig: ComponentConfig<FileDownloadWrapperProps> =
  {
    render: ({ fileIds }) => <FileDownloadClientWrapper fileIds={fileIds} />,
    fields: {
      fileIds: multipleSelectionFileTableField,
    },
  };
2;
