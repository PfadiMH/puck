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
