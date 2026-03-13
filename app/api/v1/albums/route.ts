import { dbService } from "@lib/db/db";
import { getPublicUrl, isStorageConfigured } from "@lib/storage/s3";
import { NextResponse } from "next/server";

export interface Album {
  id: string;
  title: string;
  folder: string;
  description: string | null;
  coverImageUrl: string | null;
  coverBlurhash: string | null;
  imageCount: number;
  createdAt: string;
  isVisible: boolean;
}

export async function GET() {
  try {
    if (!isStorageConfigured()) {
      return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
    }

    const folders = await dbService.getAllFolders();

    const albums: Album[] = await Promise.all(
      folders
        .filter((folder) => folder !== "/")
        .map(async (folder) => {
          const result = await dbService.queryFiles({ folder, limit: 1 });
          const firstImage = result.files[0];

          const title = folder.split("/").filter(Boolean).pop() || folder;
          const formattedTitle = title
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          return {
            id: Buffer.from(folder).toString("base64url"),
            title: formattedTitle,
            folder,
            description: null,
            coverImageUrl: firstImage ? getPublicUrl(firstImage.s3Key) : null,
            coverBlurhash: firstImage?.blurhash || null,
            imageCount: result.total,
            createdAt: firstImage?.createdAt || new Date().toISOString(),
            isVisible: true,
          };
        })
    );

    return NextResponse.json({
      success: true,
      data: albums,
    });
  } catch (error) {
    console.error("Error fetching albums:", error);
    return NextResponse.json({ error: "Failed to fetch albums" }, { status: 500 });
  }
}
