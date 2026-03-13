import { dbService } from "@lib/db/db";
import { getPublicUrl } from "@lib/storage/s3";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const albums = await dbService.getVisibleAppAlbums();

    // Resolve cover URLs from file records
    const resolved = await Promise.all(
      albums.map(async (album) => {
        let coverUrl = album.coverUrl;
        let coverBlurhash = album.coverBlurhash;

        if (album.coverImageId && !coverUrl) {
          const file = await dbService.getFile(album.coverImageId);
          if (file) {
            coverUrl = file.url || getPublicUrl(file.s3Key);
            coverBlurhash = coverBlurhash || file.blurhash;
          }
        }

        return {
          ...album,
          coverUrl,
          coverBlurhash,
          imageCount: album.imageIds.length,
        };
      })
    );

    return NextResponse.json(
      { albums: resolved, total: resolved.length },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch albums:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Alben" },
      { status: 500 }
    );
  }
}
