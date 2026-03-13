import { dbService } from "@lib/db/db";
import { getPublicUrl } from "@lib/storage/s3";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "50", 10) || 50, 1),
      200
    );
    const cursorParam = searchParams.get("cursor");
    const cursorIndex = cursorParam ? parseInt(cursorParam, 10) : 0;

    const album = await dbService.getAppAlbum(id);

    if (!album) {
      return NextResponse.json(
        { error: "Album nicht gefunden" },
        { status: 404 }
      );
    }

    // Resolve cover
    let coverUrl = album.coverUrl;
    let coverBlurhash = album.coverBlurhash;
    if (album.coverImageId && !coverUrl) {
      const coverFile = await dbService.getFile(album.coverImageId);
      if (coverFile) {
        coverUrl = coverFile.url || getPublicUrl(coverFile.s3Key);
        coverBlurhash = coverBlurhash || coverFile.blurhash;
      }
    }

    // Paginate imageIds
    const totalImages = album.imageIds.length;
    const pageIds = album.imageIds.slice(cursorIndex, cursorIndex + limit);
    const hasMore = cursorIndex + limit < totalImages;
    const nextCursor = hasMore ? String(cursorIndex + limit) : null;

    // Resolve image URLs from file records
    const images = await Promise.all(
      pageIds.map(async (fileId) => {
        const file = await dbService.getFile(fileId);
        if (!file) return null;
        return {
          id: file._id,
          url: file.url || getPublicUrl(file.s3Key),
          width: file.width,
          height: file.height,
          blurhash: file.blurhash,
          albumId: album._id,
        };
      })
    );

    return NextResponse.json(
      {
        album: {
          ...album,
          coverUrl,
          coverBlurhash,
          imageCount: totalImages,
        },
        images: images.filter(Boolean),
        nextCursor,
        total: totalImages,
      },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch album:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden des Albums" },
      { status: 500 }
    );
  }
}
