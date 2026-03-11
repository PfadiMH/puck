import { generateIcsFeed } from "@lib/calendar/ics-generator";
import { dbService } from "@lib/db/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: rawSlug } = await params;
    // Strip .ics extension and sanitize to safe characters only
    const slug = rawSlug
      .replace(/\.ics$/, "")
      .replace(/[^a-z0-9_-]/gi, "")
      .toLowerCase();

    const allGroups = await dbService.getCalendarGroups();

    // --- Unified feed endpoint: /cal/feed.ics?groups=slug1,slug2 ---
    if (slug === "feed") {
      const url = new URL(request.url);
      const groupsParam = url.searchParams.get("groups") ?? "";
      const requestedSlugs = groupsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (requestedSlugs.length === 0) {
        return new Response("Parameter 'groups' ist erforderlich", {
          status: 400,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }

      // "all" means all groups
      const isAll = requestedSlugs.includes("all");
      const slugs = isAll ? allGroups.map((g) => g.slug) : requestedSlugs;

      // Check if any requested group is a leiter group
      const groupMap = new Map(allGroups.map((g) => [g.slug, g]));
      const includeLeiterEvents = isAll || slugs.some((s) => groupMap.get(s)?.isLeiterGroup);

      const events = await dbService.getEventsByMultipleGroups(slugs, !!includeLeiterEvents);
      const names = slugs
        .map((s) => groupMap.get(s)?.name ?? s)
        .join(", ");
      const calendarName = isAll
        ? "Pfadi MH - Alle"
        : `Pfadi MH - ${names}`;

      const icsContent = generateIcsFeed(events, calendarName);
      return icsResponse(icsContent, "feed");
    }

    // --- Legacy/backward-compatible single-group patterns ---

    if (slug === "all") {
      // All events (excludes leitersitzung)
      const events = await dbService.getAllPublicEvents();
      return icsResponse(
        generateIcsFeed(events, "Pfadi MH - Alle Aktivitäten"),
        "all"
      );
    }

    if (slug === "leiter") {
      // Legacy: global Leiter feed (all events including leitersitzung)
      const events = await dbService.getAllEventsForLeiter();
      return icsResponse(
        generateIcsFeed(events, "Pfadi MH - Leiter"),
        "leiter"
      );
    }

    if (slug.startsWith("leiter-")) {
      // Legacy: per-group Leiter feed
      const groupSlug = slug.slice("leiter-".length);
      const group = allGroups.find((g) => g.slug === groupSlug);
      if (!group) {
        return notFound();
      }
      const events = await dbService.getEventsForLeiterByGroup(groupSlug);
      return icsResponse(
        generateIcsFeed(events, `Pfadi MH - Leiter ${group.name}`),
        slug
      );
    }

    // Single group feed — auto-detect if leiter group
    const group = allGroups.find((g) => g.slug === slug);
    if (!group) {
      return notFound();
    }

    const events = group.isLeiterGroup
      ? await dbService.getEventsForLeiterByGroup(slug)
      : await dbService.getEventsByGroup(slug);
    return icsResponse(
      generateIcsFeed(events, `Pfadi MH - ${group.name}`),
      slug
    );
  } catch (error) {
    console.error("Failed to generate ICS feed:", error);
    return new Response("Fehler beim Generieren des Kalender-Feeds", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

function icsResponse(content: string, filename: string): Response {
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.ics"`,
      "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
    },
  });
}

function notFound(): Response {
  return new Response("Kalendergruppe nicht gefunden", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
