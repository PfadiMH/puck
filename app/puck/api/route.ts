import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { savePage } from "@lib/database";

export async function POST(request: Request) {
  const payload = await request.json();

  await savePage(payload.path, payload.data);

  // Purge Next.js cache
  revalidatePath(payload.path);

  return NextResponse.json({ status: "ok" });
}
