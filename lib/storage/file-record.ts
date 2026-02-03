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
  /** Virtual folder path, e.g. "/events/2024" or "/" for root */
  folder?: string;
  /** Freeform tags, normalized to lowercase */
  tags?: string[];
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
  /** Virtual folder path, e.g. "/events/2024" or "/" for root */
  folder?: string;
  /** Freeform tags, normalized to lowercase */
  tags?: string[];
}

export type FileRecordInput = Omit<FileRecordDb, "_id" | "createdAt">;
