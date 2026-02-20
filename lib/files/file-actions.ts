"use server";

import { dbService } from "@lib/db/db";
import { requireServerPermission } from "@lib/security/server-guard";
import { isImageMimeType, processImage } from "@lib/storage/image-utils";
import {
  deleteFile as deleteS3File,
  getPublicUrl,
  isStorageConfigured,
  uploadFile as uploadS3File,
} from "@lib/storage/s3";
import type { FileRecord } from "@lib/storage/file-record";
import { ALLOWED_TYPES, MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from "./constants";

export type FileWithUrl = FileRecord & { url: string };

export interface FileActionResult<T> {
  success: true;
  data: T;
}

export interface FileActionError {
  success: false;
  error: string;
}

export type FileActionResponse<T> = FileActionResult<T> | FileActionError;

/**
 * Get all files with their public URLs.
 */
export async function getAllFiles(): Promise<FileActionResponse<FileWithUrl[]>> {
  try {
    await requireServerPermission({ all: ["files:read"] });

    if (!isStorageConfigured()) {
      return { success: false, error: "Storage not configured" };
    }

    const files = await dbService.getAllFiles();
    const withUrls = files.map((f) => ({
      ...f,
      url: getPublicUrl(f.s3Key),
    }));

    return { success: true, data: withUrls };
  } catch (error) {
    console.error("Error listing files:", error);
    return { success: false, error: "Failed to list files" };
  }
}

export interface FileQueryParams {
  folder?: string;
  search?: string;
  tags?: string[];
  limit?: number;
  cursor?: string;
}

export interface FileQueryResultWithUrls {
  files: FileWithUrl[];
  nextCursor: string | null;
  total: number;
}

/**
 * Query files with pagination and filtering.
 */
export async function queryFiles(
  params: FileQueryParams
): Promise<FileActionResponse<FileQueryResultWithUrls>> {
  try {
    await requireServerPermission({ all: ["files:read"] });

    if (!isStorageConfigured()) {
      return { success: false, error: "Storage not configured" };
    }

    const result = await dbService.queryFiles(params);
    const filesWithUrls = result.files.map((f) => ({
      ...f,
      url: getPublicUrl(f.s3Key),
    }));

    return {
      success: true,
      data: {
        files: filesWithUrls,
        nextCursor: result.nextCursor,
        total: result.total,
      },
    };
  } catch (error) {
    console.error("Error querying files:", error);
    return { success: false, error: "Failed to query files" };
  }
}

/**
 * Count files matching the given filters (for select all).
 */
export async function countFiles(
  params: Omit<FileQueryParams, "limit" | "cursor">
): Promise<FileActionResponse<number>> {
  try {
    await requireServerPermission({ all: ["files:read"] });

    const count = await dbService.countFiles(params);
    return { success: true, data: count };
  } catch (error) {
    console.error("Error counting files:", error);
    return { success: false, error: "Failed to count files" };
  }
}

/**
 * Normalize tags: lowercase, trim, remove duplicates.
 */
function normalizeTags(tags: string[] | undefined): string[] | undefined {
  if (!tags || tags.length === 0) return undefined;
  const normalized = [...new Set(tags.map((t) => t.toLowerCase().trim()))];
  return normalized.length > 0 ? normalized : undefined;
}

/**
 * Normalize and sanitize folder path.
 * - Removes path traversal attempts (.., .)
 * - Only allows alphanumeric, dash, underscore, and slash
 * - Ensures path starts with "/" and doesn't end with "/"
 * - Collapses multiple slashes
 */
function normalizeFolder(folder: string | undefined): string | undefined {
  if (!folder || folder === "/") return "/";

  let normalized = folder.trim();

  // Remove path traversal attempts
  normalized = normalized.replace(/\.{2,}/g, "");
  normalized = normalized.replace(/\/\./g, "/");

  // Only allow safe characters: alphanumeric, dash, underscore, slash, space
  // Convert spaces to dashes for URL-friendliness
  normalized = normalized.replace(/\s+/g, "-");
  normalized = normalized.replace(/[^a-zA-Z0-9\-_\/]/g, "");

  // Collapse multiple slashes
  normalized = normalized.replace(/\/+/g, "/");

  // Ensure starts with /
  if (!normalized.startsWith("/")) normalized = "/" + normalized;

  // Remove trailing slash
  if (normalized.endsWith("/") && normalized.length > 1) {
    normalized = normalized.slice(0, -1);
  }

  return normalized || "/";
}

/**
 * Upload a file to storage.
 */
export async function uploadFile(
  formData: FormData
): Promise<FileActionResponse<FileWithUrl>> {
  try {
    const session = await requireServerPermission({ all: ["files:create"] });

    if (!isStorageConfigured()) {
      return { success: false, error: "Storage not configured" };
    }

    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;
    const tagsRaw = formData.get("tags") as string | null;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: `File too large (max ${MAX_FILE_SIZE_MB}MB)` };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return { success: false, error: "File type not allowed" };
    }

    // Parse tags from comma-separated string
    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : undefined;

    const buffer = Buffer.from(await file.arrayBuffer());
    const isImage = isImageMimeType(file.type);

    let finalBuffer: Buffer = buffer;
    let contentType = file.type;
    let width: number | undefined;
    let height: number | undefined;
    let blurhash: string | undefined;

    // Process images (convert to webp, get dimensions, generate blurhash)
    if (isImage && file.type !== "image/svg+xml") {
      try {
        const result = await processImage(buffer);
        finalBuffer = result.processed;
        contentType = "image/webp";
        width = result.metadata.width;
        height = result.metadata.height;
        blurhash = result.metadata.blurhash;
      } catch (err) {
        console.error("Image processing failed, using original:", err);
      }
    }

    // Generate S3 key
    const ext =
      contentType === "image/webp" ? "webp" : file.name.split(".").pop();
    const prefix = isImage ? "images" : "files";
    const s3Key = `${prefix}/${crypto.randomUUID()}.${ext}`;

    // Upload to S3
    await uploadS3File(s3Key, finalBuffer, contentType);

    // Save metadata to database
    const user = session.user as unknown as Record<string, unknown> | undefined;
    const record = await dbService.saveFile({
      filename: file.name,
      s3Key,
      contentType,
      size: finalBuffer.length,
      width,
      height,
      blurhash,
      uploadedBy:
        (user?.id as string) ||
        (user?.email as string) ||
        (user?.name as string) ||
        "unknown",
      folder: normalizeFolder(folder || undefined),
      tags: normalizeTags(tags),
    });

    return {
      success: true,
      data: {
        ...record,
        url: getPublicUrl(s3Key),
      },
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error: "Failed to upload file" };
  }
}

/**
 * Delete a file from storage.
 */
export async function deleteFile(
  id: string
): Promise<FileActionResponse<{ deleted: true }>> {
  try {
    await requireServerPermission({ all: ["files:delete"] });

    // Get file metadata
    const file = await dbService.getFile(id);
    if (!file) {
      return { success: false, error: "File not found" };
    }

    // Delete from S3 first
    try {
      await deleteS3File(file.s3Key);
    } catch (err) {
      console.error("Failed to delete from S3:", err);
      return { success: false, error: "Failed to delete file from storage" };
    }

    // Delete metadata only after S3 deletion succeeds
    // If this fails, we have an orphaned DB record but no S3 file - log for cleanup
    try {
      await dbService.deleteFile(id);
    } catch (err) {
      console.error(
        "CRITICAL: S3 file deleted but DB record deletion failed. Orphaned record:",
        id,
        err
      );
      // Still return success since the actual file is gone
      // The orphaned record should be cleaned up manually or by a cleanup job
    }

    return { success: true, data: { deleted: true } };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, error: "Failed to delete file" };
  }
}

/**
 * Update file metadata (folder, tags).
 * Note: Uses files:create permission for consistency with page:create pattern
 * where create permission covers both creation and modification.
 */
export async function updateFile(
  id: string,
  updates: { folder?: string; tags?: string[] }
): Promise<FileActionResponse<FileWithUrl>> {
  try {
    await requireServerPermission({ all: ["files:create"] });

    if (!isStorageConfigured()) {
      return { success: false, error: "Storage not configured" };
    }

    const normalizedUpdates: { folder?: string; tags?: string[] } = {};

    if (updates.folder !== undefined) {
      normalizedUpdates.folder = normalizeFolder(updates.folder);
    }

    if (updates.tags !== undefined) {
      normalizedUpdates.tags = normalizeTags(updates.tags);
    }

    const record = await dbService.updateFile(id, normalizedUpdates);

    if (!record) {
      return { success: false, error: "File not found" };
    }

    return {
      success: true,
      data: {
        ...record,
        url: getPublicUrl(record.s3Key),
      },
    };
  } catch (error) {
    console.error("Error updating file:", error);
    return { success: false, error: "Failed to update file" };
  }
}

/**
 * Get all unique folder paths.
 */
export async function getAllFolders(): Promise<FileActionResponse<string[]>> {
  try {
    await requireServerPermission({ all: ["files:read"] });

    const folders = await dbService.getAllFolders();

    return { success: true, data: folders };
  } catch (error) {
    console.error("Error getting folders:", error);
    return { success: false, error: "Failed to get folders" };
  }
}
