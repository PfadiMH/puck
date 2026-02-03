import { deleteFile } from "@lib/files/file-actions";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/files/[id] - Delete a file
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await deleteFile(id);

  if (!result.success) {
    let status = 500;
    if (result.error === "File not found") status = 404;
    else if (result.error === "Failed to delete file from storage") status = 502;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ success: true });
}
