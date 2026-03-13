import { dbService } from "@lib/db/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const groupsParam = searchParams.get("groups");
    const limitParam = searchParams.get("limit");

    const limit = Math.min(
      Math.max(parseInt(limitParam || "50", 10) || 50, 1),
      200
    );

    let events;

    if (groupsParam) {
      const slugs = groupsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (slugs.length === 0) {
        return NextResponse.json(
          { error: "Parameter 'groups' darf nicht leer sein" },
          { status: 400 }
        );
      }

      events = await dbService.getEventsByMultipleGroups(slugs, false);
    } else {
      events = await dbService.getAllPublicEvents();
    }

    const limited = events.slice(0, limit);

    return NextResponse.json(limited, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Failed to fetch calendar events:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Kalender-Events" },
      { status: 500 }
    );
  }
}
