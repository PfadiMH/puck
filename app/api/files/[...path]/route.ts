import { getFile } from "@lib/storage/s3";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/files/images/xxx.webp  (or any S3 key path)
 *
 * Streams the file from S3 and returns it with proper headers.
 * This route is needed because the B2 bucket is private and
 * S3_PUBLIC_URL points to this app domain.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const key = path.map(decodeURIComponent).join("/");

  if (!key) {
    return NextResponse.json({ error: "No path provided" }, { status: 400 });
  }

  const file = await getFile(key);

  if (!file) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(file.body, {
    status: 200,
    headers: {
      "Content-Type": file.contentType,
      ...(file.contentLength != null && {
        "Content-Length": String(file.contentLength),
      }),
      // Immutable cache: S3 keys are content-addressed UUIDs
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
