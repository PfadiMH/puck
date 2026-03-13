import { dbService } from "@lib/db/db";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await dbService.getCalendarEvent(id);

    if (!event) {
      return NextResponse.json(
        { error: "Event nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json(event, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Failed to fetch calendar event:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden des Events" },
      { status: 500 }
    );
  }
}
