"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  countFiles,
  deleteFile,
  getAllFiles,
  getAllFolders,
  queryFiles,
  updateFile,
  uploadFile,
  type FileQueryParams,
  type FileQueryResultWithUrls,
  type FileWithUrl,
} from "./file-actions";

export const FILE_QUERY_KEY = ["files"] as const;
export const FOLDER_QUERY_KEY = ["folders"] as const;

/**
 * Hook to fetch all files (simple, no pagination).
 */
export function useFiles() {
  return useQuery({
    queryKey: FILE_QUERY_KEY,
    queryFn: async (): Promise<FileWithUrl[]> => {
      const result = await getAllFiles();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}

export interface UseFilesInfiniteOptions {
  folder?: string;
  search?: string;
  tags?: string[];
  limit?: number;
}

/**
 * Hook for infinite scroll file loading with filtering.
 */
export function useFilesInfinite(options: UseFilesInfiniteOptions = {}) {
  const { folder, search, tags, limit = 50 } = options;

  return useInfiniteQuery<FileQueryResultWithUrls, Error>({
    queryKey: [...FILE_QUERY_KEY, "infinite", { folder, search, tags }],
    queryFn: async ({ pageParam }): Promise<FileQueryResultWithUrls> => {
      const params: FileQueryParams = {
        folder,
        search,
        tags,
        limit,
        cursor: pageParam as string | undefined,
      };
      const result = await queryFiles(params);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

/**
 * Hook to count files matching filters (for select all).
 */
export function useFileCount(options: Omit<UseFilesInfiniteOptions, "limit"> = {}) {
  const { folder, search, tags } = options;

  return useQuery({
    queryKey: [...FILE_QUERY_KEY, "count", { folder, search, tags }],
    queryFn: async (): Promise<number> => {
      const result = await countFiles({ folder, search, tags });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}

/**
 * Hook to fetch all folders.
 */
export function useFolders() {
  return useQuery({
    queryKey: FOLDER_QUERY_KEY,
    queryFn: async (): Promise<string[]> => {
      const result = await getAllFolders();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}

export interface UploadFileOptions {
  file: File;
  folder?: string;
  tags?: string[];
}

/**
 * Hook to upload a file.
 */
export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      folder,
      tags,
    }: UploadFileOptions): Promise<FileWithUrl> => {
      const formData = new FormData();
      formData.append("file", file);
      if (folder) formData.append("folder", folder);
      if (tags && tags.length > 0) formData.append("tags", tags.join(","));

      const result = await uploadFile(formData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: FOLDER_QUERY_KEY });
    },
  });
}

/**
 * Hook to update file metadata (folder, tags).
 */
export function useUpdateFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      folder,
      tags,
    }: {
      id: string;
      folder?: string;
      tags?: string[];
    }): Promise<FileWithUrl> => {
      const result = await updateFile(id, { folder, tags });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: FOLDER_QUERY_KEY });
    },
  });
}

/**
 * Hook to delete a file.
 */
export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const result = await deleteFile(id);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FILE_QUERY_KEY });
    },
  });
}
