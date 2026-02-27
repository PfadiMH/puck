import { generateIcsFeed } from "@lib/calendar/ics-generator";
import { dbService } from "@lib/db/db";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: rawSlug } = await params;
    // Strip .ics extension if present
    const slug = rawSlug.replace(/\.ics$/, "");

    let events;
    let calendarName: string;

    if (slug === "all") {
      // All events feed
      events = await dbService.getCalendarEvents();
      calendarName = "Pfadi MH - Alle Aktivitäten";
    } else {
      // Group-specific feed
      const groups = await dbService.getCalendarGroups();
      const group = groups.find((g) => g.slug === slug);

      if (!group) {
        return NextResponse.json(
          { error: "Kalendergruppe nicht gefunden" },
          { status: 404 }
        );
      }

      events = await dbService.getEventsByGroup(slug);
      calendarName = `Pfadi MH - ${group.name}`;
    }

    const icsContent = generateIcsFeed(events, calendarName);

    return new Response(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${slug}.ics"`,
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Failed to generate ICS feed:", error);
    return NextResponse.json(
      { error: "Fehler beim Generieren des Kalender-Feeds" },
      { status: 500 }
    );
  }
}
