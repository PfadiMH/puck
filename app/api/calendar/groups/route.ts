import { dbService } from "@lib/db/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const groups = await dbService.getCalendarGroups();
    return NextResponse.json(groups, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Failed to fetch calendar groups:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Kalendergruppen" },
      { status: 500 }
    );
  }
}
