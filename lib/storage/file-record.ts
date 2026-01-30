export interface FileRecordDb {
  _id: string;
  filename: string;
  s3Key: string;
  contentType: string;
  size: number;
  width?: number;
  height?: number;
  blurhash?: string;
  uploadedBy: string;
  createdAt: Date;
}

export interface FileRecord {
  _id: string;
  filename: string;
  s3Key: string;
  contentType: string;
  size: number;
  width?: number;
  height?: number;
  blurhash?: string;
  uploadedBy: string;
  createdAt: string;
  url?: string;
}

export type FileRecordInput = Omit<FileRecordDb, "_id" | "createdAt">;

/**
 * Subset of file metadata stored in Puck component props.
 * Used by Image and DownloadButton components to access S3 file info.
 */
export type FileSelection = {
  url: string;
  size: number;
  filename: string;
  contentType: string;
  blurhash?: string;
  width?: number;
  height?: number;
};
