import { dbService } from "@lib/db/db";
import { getPublicUrl, isStorageConfigured } from "@lib/storage/s3";
import { NextRequest, NextResponse } from "next/server";
import type { Album } from "../route";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ folder: string }> }
) {
  try {
    if (!isStorageConfigured()) {
      return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
    }

    const { folder: encodedFolder } = await params;
    const folder = Buffer.from(encodedFolder, "base64url").toString("utf-8");

    const result = await dbService.queryFiles({ folder, limit: 1 });

    if (result.total === 0) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    const firstImage = result.files[0];
    const title = folder.split("/").filter(Boolean).pop() || folder;
    const formattedTitle = title
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const album: Album = {
      id: encodedFolder,
      title: formattedTitle,
      folder,
      description: null,
      coverImageUrl: firstImage ? getPublicUrl(firstImage.s3Key) : null,
      coverBlurhash: firstImage?.blurhash || null,
      imageCount: result.total,
      createdAt: firstImage?.createdAt || new Date().toISOString(),
      isVisible: true,
    };

    return NextResponse.json(album);
  } catch (error) {
    console.error("Error fetching album:", error);
    return NextResponse.json({ error: "Failed to fetch album" }, { status: 500 });
  }
}
