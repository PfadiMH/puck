import { dbService } from "@lib/db/db";
import { requireServerPermission } from "@lib/security/server-guard";
import { isImageMimeType, processImage } from "@lib/storage/image-utils";
import { getPublicUrl, isStorageConfigured, uploadFile } from "@lib/storage/s3";
import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
];

// GET /api/files - List all files
export async function GET() {
  try {
    await requireServerPermission({ all: ["files:read"] });
    if (!isStorageConfigured()) {
      return NextResponse.json(
        { error: "Storage not configured" },
        { status: 503 }
      );
    }
    const files = await dbService.getAllFiles();
    const withUrls = files.map((f) => ({
      ...f,
      url: getPublicUrl(f.s3Key),
    }));
    return NextResponse.json(withUrls);
  } catch (error) {
    console.error("Error listing files:", error);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
  }
}

// POST /api/files - Upload a file
export async function POST(request: NextRequest) {
  try {
    const session = await requireServerPermission({ all: ["files:create"] });
    if (!isStorageConfigured()) {
      return NextResponse.json(
        { error: "Storage not configured" },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      );
    }

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
    const ext = contentType === "image/webp" ? "webp" : file.name.split(".").pop();
    const prefix = isImage ? "images" : "files";
    const s3Key = `${prefix}/${crypto.randomUUID()}.${ext}`;

    // Upload to S3
    await uploadFile(s3Key, finalBuffer, contentType);

    // Save metadata to database
    const record = await dbService.saveFile({
      filename: file.name,
      s3Key,
      contentType,
      size: finalBuffer.length,
      width,
      height,
      blurhash,
      uploadedBy:
        (session.user as any)?.id ||
        (session.user as any)?.email ||
        (session.user as any)?.name ||
        "unknown",
    });

    return NextResponse.json({
      ...record,
      url: getPublicUrl(s3Key),
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
