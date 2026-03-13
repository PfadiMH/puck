"use server";

import { requireServerPermission } from "@lib/security/server-guard";
import type { AppAlbum, AppAlbumInput } from "@lib/gallery/types";
import { dbService } from "./db";
import { getPublicUrl } from "@lib/storage/s3";

// --- Admin actions (require permission) ---

export async function getAppAlbums(): Promise<AppAlbum[]> {
  await requireServerPermission({ all: ["calendar:read"] });
  const albums = await dbService.getAppAlbums();
  return resolveAlbumCovers(albums);
}

export async function getAppAlbum(id: string): Promise<AppAlbum | null> {
  await requireServerPermission({ all: ["calendar:read"] });
  const album = await dbService.getAppAlbum(id);
  if (!album) return null;
  return (await resolveAlbumCovers([album]))[0];
}

export async function saveAppAlbum(
  input: AppAlbumInput
): Promise<AppAlbum> {
  await requireServerPermission({ all: ["calendar:update"] });
  const album = await dbService.saveAppAlbum(input);
  return (await resolveAlbumCovers([album]))[0];
}

export async function updateAppAlbum(
  id: string,
  input: Partial<AppAlbumInput>
): Promise<AppAlbum | null> {
  await requireServerPermission({ all: ["calendar:update"] });
  const album = await dbService.updateAppAlbum(id, input);
  if (!album) return null;
  return (await resolveAlbumCovers([album]))[0];
}

export async function deleteAppAlbum(id: string): Promise<void> {
  await requireServerPermission({ all: ["calendar:update"] });
  await dbService.deleteAppAlbum(id);
}

// --- Helpers ---

async function resolveAlbumCovers(albums: AppAlbum[]): Promise<AppAlbum[]> {
  return Promise.all(
    albums.map(async (album) => {
      let coverUrl = album.coverUrl;
      let coverBlurhash = album.coverBlurhash;

      if (album.coverImageId && !coverUrl) {
        try {
          const file = await dbService.getFile(album.coverImageId);
          if (file) {
            coverUrl = file.url || getPublicUrl(file.s3Key);
            coverBlurhash = coverBlurhash || file.blurhash;
          }
        } catch {
          // S3 not configured, skip cover resolution
        }
      }

      return { ...album, coverUrl, coverBlurhash };
    })
  );
}
