"use server";

import type {
  CalendarEvent,
  CalendarEventInput,
  CalendarGroup,
  CalendarGroupInput,
} from "@lib/calendar/types";
import { sendToGroups } from "@lib/notifications/fcm";
import { requireServerPermission } from "@lib/security/server-guard";
import { dbService } from "./db";

// --- Validation ---

const RESERVED_SLUGS = ["all", "feed"];

function validateGroupSlug(slug: string): void {
  if (RESERVED_SLUGS.includes(slug)) {
    throw new Error(
      `Slug "${slug}" ist reserviert und kann nicht verwendet werden`
    );
  }
}

// --- Calendar Groups ---

export async function getCalendarGroups(): Promise<CalendarGroup[]> {
  await requireServerPermission({ all: ["calendar:read"] });
  return dbService.getCalendarGroups();
}

export async function getCalendarGroup(
  id: string
): Promise<CalendarGroup | null> {
  await requireServerPermission({ all: ["calendar:read"] });
  return dbService.getCalendarGroup(id);
}

export async function saveCalendarGroup(
  group: CalendarGroupInput
): Promise<CalendarGroup> {
  await requireServerPermission({ all: ["calendar:update"] });
  validateGroupSlug(group.slug);
  return dbService.saveCalendarGroup(group);
}

export async function updateCalendarGroup(
  id: string,
  group: CalendarGroupInput
): Promise<CalendarGroup | null> {
  await requireServerPermission({ all: ["calendar:update"] });
  validateGroupSlug(group.slug);
  return dbService.updateCalendarGroup(id, group);
}

export async function deleteCalendarGroup(id: string): Promise<void> {
  await requireServerPermission({ all: ["calendar:update"] });
  return dbService.deleteCalendarGroup(id);
}

// --- Calendar Events ---

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  await requireServerPermission({ all: ["calendar:read"] });
  return dbService.getCalendarEvents();
}

export async function getCalendarEvent(
  id: string
): Promise<CalendarEvent | null> {
  await requireServerPermission({ all: ["calendar:read"] });
  return dbService.getCalendarEvent(id);
}

export async function saveCalendarEvent(
  event: CalendarEventInput
): Promise<CalendarEvent> {
  await requireServerPermission({ all: ["calendar:update"] });
  const saved = await dbService.saveCalendarEvent(event);

  // Send push notification to relevant groups
  const groupSlugs = saved.allGroups
    ? (await dbService.getCalendarGroups()).map((g) => g.slug)
    : saved.groups;

  if (groupSlugs.length > 0) {
    const [, month, day] = saved.date.split("-");
    const dateLabel = `${parseInt(day)}.${parseInt(month)}.`;
    sendToGroups(groupSlugs, saved.title, `${dateLabel} ${saved.startTime}`, {
      eventId: saved._id,
      type: "event_created",
    }).catch(() => {});
  }

  return saved;
}

export async function updateCalendarEvent(
  id: string,
  event: CalendarEventInput
): Promise<CalendarEvent | null> {
  await requireServerPermission({ all: ["calendar:update"] });
  const updated = await dbService.updateCalendarEvent(id, event);

  if (updated) {
    const groupSlugs = updated.allGroups
      ? (await dbService.getCalendarGroups()).map((g) => g.slug)
      : updated.groups;

    if (groupSlugs.length > 0) {
      const [, month, day] = updated.date.split("-");
      const dateLabel = `${parseInt(day)}.${parseInt(month)}.`;
      sendToGroups(
        groupSlugs,
        `${updated.title} (aktualisiert)`,
        `${dateLabel} ${updated.startTime}`,
        { eventId: updated._id, type: "event_updated" }
      ).catch(() => {});
    }
  }

  return updated;
}

export async function deleteCalendarEvent(id: string): Promise<void> {
  await requireServerPermission({ all: ["calendar:update"] });
  return dbService.deleteCalendarEvent(id);
}

// --- Public (no auth required) ---

/** Public — no auth required. Used by ICS feeds and Activity component. */
export async function getPublicCalendarGroups(): Promise<CalendarGroup[]> {
  return dbService.getCalendarGroups();
}

/** Public — no auth required. Used by Activity component in calendar mode. */
export async function getPublicNextUpcomingEvent(
  groupSlug: string
): Promise<CalendarEvent | null> {
  return dbService.getNextUpcomingEvent(groupSlug);
}

/** Public — no auth required. Used by ICS feed generation. */
export async function getPublicEventsByGroup(
  groupSlug: string
): Promise<CalendarEvent[]> {
  return dbService.getEventsByGroup(groupSlug);
}

/** Public — no auth required. Used by ICS "all" feed. Excludes leitersitzung. */
export async function getPublicAllCalendarEvents(): Promise<CalendarEvent[]> {
  return dbService.getAllPublicEvents();
}

/** Public — no auth required. Used by Leiter ICS feed (all events). */
export async function getPublicAllEventsForLeiter(): Promise<
  CalendarEvent[]
> {
  return dbService.getAllEventsForLeiter();
}

/** Public — no auth required. Used by per-group Leiter ICS feed. */
export async function getPublicEventsForLeiterByGroup(
  groupSlug: string
): Promise<CalendarEvent[]> {
  return dbService.getEventsForLeiterByGroup(groupSlug);
}

/** Public — no auth required. Unified feed query with multi-group support. */
export async function getPublicEventsByMultipleGroups(
  slugs: string[],
  includeLeiterEvents: boolean
): Promise<CalendarEvent[]> {
  return dbService.getEventsByMultipleGroups(slugs, includeLeiterEvents);
}
