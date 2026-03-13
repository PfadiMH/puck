import { dbService } from "@lib/db/db";
import { getPublicUrl, isStorageConfigured } from "@lib/storage/s3";
import { NextRequest, NextResponse } from "next/server";

export interface GalleryImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  blurhash: string | null;
  albumId: string | null;
  createdAt: string;
}

export async function GET(request: NextRequest) {
  try {
    if (!isStorageConfigured()) {
      return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const albumId = searchParams.get("albumId");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const cursor = searchParams.get("cursor") || undefined;

    let folder: string | undefined;
    if (albumId) {
      folder = Buffer.from(albumId, "base64url").toString("utf-8");
    }

    const result = await dbService.queryFiles({
      folder,
      limit,
      cursor,
    });

    const images: GalleryImage[] = result.files
      .filter((file) => file.contentType.startsWith("image/"))
      .map((file) => {
        const url = getPublicUrl(file.s3Key);
        return {
          id: file._id,
          url,
          thumbnailUrl: url,
          width: file.width || 0,
          height: file.height || 0,
          blurhash: file.blurhash || null,
          albumId: file.folder ? Buffer.from(file.folder).toString("base64url") : null,
          createdAt: file.createdAt,
        };
      });

    return NextResponse.json({
      success: true,
      data: images,
      pagination: {
        nextCursor: result.nextCursor,
        total: result.total,
      },
    });
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json({ error: "Failed to fetch gallery images" }, { status: 500 });
  }
}
