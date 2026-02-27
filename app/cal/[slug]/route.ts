import { generateIcsFeed } from "@lib/calendar/ics-generator";
import { dbService } from "@lib/db/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: rawSlug } = await params;
    // Strip .ics extension and sanitize to safe characters only
    const slug = rawSlug
      .replace(/\.ics$/, "")
      .replace(/[^a-z0-9_-]/gi, "")
      .toLowerCase();

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
        return new Response("Kalendergruppe nicht gefunden", {
          status: 404,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }

      events = await dbService.getEventsByGroup(slug);
      calendarName = `Pfadi MH - ${group.name}`;
    }

    const icsContent = generateIcsFeed(events, calendarName);

    return new Response(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${slug || "calendar"}.ics"`,
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Failed to generate ICS feed:", error);
    return new Response("Fehler beim Generieren des Kalender-Feeds", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
