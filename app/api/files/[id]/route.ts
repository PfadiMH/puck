import { dbService } from "@lib/db/db";
import { deleteFile as deleteS3File } from "@lib/storage/s3";
import { requireServerPermission } from "@lib/security/server-guard";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/files/[id] - Delete a file
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireServerPermission({ all: ["files:delete"] });
    const { id } = await params;
    
    // Get file metadata
    const file = await dbService.getFile(id);
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Delete from S3
    try {
      await deleteS3File(file.s3Key);
    } catch (err) {
      console.error("Failed to delete from S3:", err);
      // Continue to delete metadata even if S3 fails
    }

    // Delete metadata
    await dbService.deleteFile(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
