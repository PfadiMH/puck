import {
  getAllFiles,
  uploadFile,
} from "@lib/files/file-actions";
import { NextRequest, NextResponse } from "next/server";

// GET /api/files - List all files
export async function GET() {
  const result = await getAllFiles();

  if (!result.success) {
    const status = result.error === "Storage not configured" ? 503 : 500;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json(result.data);
}

// POST /api/files - Upload a file
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const result = await uploadFile(formData);

  if (!result.success) {
    let status = 500;
    if (result.error === "Storage not configured") status = 503;
    else if (
      result.error === "No file provided" ||
      result.error.startsWith("File too large") ||
      result.error === "File type not allowed"
    ) {
      status = 400;
    }
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json(result.data);
}
