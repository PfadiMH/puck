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
  createdAt: Date;
  // Not persisted; convenience for API responses
  url?: string;
}

export type FileRecordInput = Omit<FileRecord, "_id" | "createdAt">;
