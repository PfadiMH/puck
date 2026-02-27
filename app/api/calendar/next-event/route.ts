import { dbService } from "@lib/db/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const group = searchParams.get("group");

    if (!group) {
      return NextResponse.json(
        { error: "Parameter 'group' ist erforderlich" },
        { status: 400 }
      );
    }

    const event = await dbService.getNextUpcomingEvent(group);

    return NextResponse.json(event, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Failed to fetch next event:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden des nächsten Events" },
      { status: 500 }
    );
  }
}
