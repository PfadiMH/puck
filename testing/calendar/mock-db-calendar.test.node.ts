import type { CalendarEventInput, CalendarGroupInput } from "@lib/calendar/types";
import { MockDatabaseService } from "@lib/db/db-mock-impl";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function eventInput(
  overrides: Partial<CalendarEventInput> = {}
): CalendarEventInput {
  return {
    title: "Test Event",
    date: "2026-06-15",
    startTime: "14:00",
    endTime: "17:00",
    groups: ["woelfli"],
    allGroups: false,
    mitnehmen: [],
    ...overrides,
  };
}

function groupInput(
  overrides: Partial<CalendarGroupInput> = {}
): CalendarGroupInput {
  return {
    slug: "woelfli",
    name: "Wölfli",
    order: 1,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("MockDatabaseService — Calendar", () => {
  let db: MockDatabaseService;

  beforeEach(() => {
    db = new MockDatabaseService();
  });

  // ===== Groups =====

  describe("group CRUD", () => {
    test("saves and retrieves a group", async () => {
      const saved = await db.saveCalendarGroup(groupInput());
      expect(saved._id).toBeDefined();
      expect(saved.slug).toBe("woelfli");
      expect(saved.name).toBe("Wölfli");
      expect(saved.order).toBe(1);

      const fetched = await db.getCalendarGroup(saved._id);
      expect(fetched).toEqual(saved);
    });

    test("returns null for non-existent group", async () => {
      expect(await db.getCalendarGroup("nonexistent")).toBeNull();
    });

    test("lists groups sorted by order", async () => {
      await db.saveCalendarGroup(groupInput({ slug: "pfadi", name: "Pfadi", order: 3 }));
      await db.saveCalendarGroup(groupInput({ slug: "biber", name: "Biber", order: 1 }));
      await db.saveCalendarGroup(groupInput({ slug: "woelfli", name: "Wölfli", order: 2 }));

      const groups = await db.getCalendarGroups();
      expect(groups.map((g) => g.slug)).toEqual(["biber", "woelfli", "pfadi"]);
    });

    test("updates a group", async () => {
      const saved = await db.saveCalendarGroup(groupInput());
      const updated = await db.updateCalendarGroup(
        saved._id,
        groupInput({ slug: "pfadi", name: "Pfadistufe", order: 5 })
      );
      expect(updated?.slug).toBe("pfadi");
      expect(updated?.name).toBe("Pfadistufe");
      expect(updated?.order).toBe(5);
    });

    test("returns null when updating non-existent group", async () => {
      const result = await db.updateCalendarGroup("nope", groupInput());
      expect(result).toBeNull();
    });

    test("deletes a group", async () => {
      const saved = await db.saveCalendarGroup(groupInput());
      await db.deleteCalendarGroup(saved._id);
      expect(await db.getCalendarGroup(saved._id)).toBeNull();
      expect(await db.getCalendarGroups()).toHaveLength(0);
    });
  });

  // ===== Slug cascade =====

  describe("group slug cascade", () => {
    test("updating a group slug cascades to event references", async () => {
      const group = await db.saveCalendarGroup(groupInput({ slug: "old-slug" }));
      const event = await db.saveCalendarEvent(
        eventInput({ groups: ["old-slug", "other"], allGroups: false })
      );

      await db.updateCalendarGroup(
        group._id,
        groupInput({ slug: "new-slug" })
      );

      const fetched = await db.getCalendarEvent(event._id);
      expect(fetched?.groups).toContain("new-slug");
      expect(fetched?.groups).not.toContain("old-slug");
      expect(fetched?.groups).toContain("other"); // other slugs untouched
    });

    test("does not cascade when slug is unchanged", async () => {
      const group = await db.saveCalendarGroup(groupInput({ slug: "same" }));
      const event = await db.saveCalendarEvent(
        eventInput({ groups: ["same"] })
      );

      await db.updateCalendarGroup(
        group._id,
        groupInput({ slug: "same", name: "Renamed" })
      );

      const fetched = await db.getCalendarEvent(event._id);
      expect(fetched?.groups).toEqual(["same"]);
    });
  });

  // ===== Event CRUD =====

  describe("event CRUD", () => {
    test("saves an event with generated _id, uid, and timestamps", async () => {
      const saved = await db.saveCalendarEvent(eventInput({ title: "Hike" }));
      expect(saved._id).toBeDefined();
      expect(saved.uid).toBe(`event-${saved._id}@pfadimh.ch`);
      expect(saved.title).toBe("Hike");
      expect(saved.createdAt).toBeDefined();
      expect(saved.updatedAt).toBeDefined();
    });

    test("retrieves an event by id", async () => {
      const saved = await db.saveCalendarEvent(eventInput());
      const fetched = await db.getCalendarEvent(saved._id);
      expect(fetched).toEqual(saved);
    });

    test("returns null for non-existent event", async () => {
      expect(await db.getCalendarEvent("nope")).toBeNull();
    });

    test("updates an event and refreshes updatedAt", async () => {
      vi.useFakeTimers();
      try {
        vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
        const saved = await db.saveCalendarEvent(eventInput({ title: "Old" }));
        const originalUpdatedAt = saved.updatedAt;

        vi.setSystemTime(new Date("2025-01-01T00:00:01Z"));
        const updated = await db.updateCalendarEvent(
          saved._id,
          eventInput({ title: "New" })
        );
        expect(updated?.title).toBe("New");
        expect(updated?.updatedAt).not.toBe(originalUpdatedAt);
        expect(updated?.createdAt).toBe(saved.createdAt); // createdAt unchanged
      } finally {
        vi.useRealTimers();
      }
    });

    test("returns null when updating non-existent event", async () => {
      const result = await db.updateCalendarEvent("nope", eventInput());
      expect(result).toBeNull();
    });

    test("deletes an event", async () => {
      const saved = await db.saveCalendarEvent(eventInput());
      await db.deleteCalendarEvent(saved._id);
      expect(await db.getCalendarEvent(saved._id)).toBeNull();
    });
  });

  // ===== getCalendarEvents (all, admin) =====

  describe("getCalendarEvents", () => {
    test("returns all events including leitersitzung", async () => {
      await db.saveCalendarEvent(eventInput({ title: "A", eventType: "aktivitaet" }));
      await db.saveCalendarEvent(eventInput({ title: "L", eventType: "lager" }));
      await db.saveCalendarEvent(eventInput({ title: "S", eventType: "leitersitzung" }));

      const events = await db.getCalendarEvents();
      expect(events).toHaveLength(3);
    });

    test("sorts by date then startTime", async () => {
      await db.saveCalendarEvent(eventInput({ title: "C", date: "2026-06-17", startTime: "09:00" }));
      await db.saveCalendarEvent(eventInput({ title: "A", date: "2026-06-15", startTime: "10:00" }));
      await db.saveCalendarEvent(eventInput({ title: "B", date: "2026-06-15", startTime: "14:00" }));

      const events = await db.getCalendarEvents();
      expect(events.map((e) => e.title)).toEqual(["A", "B", "C"]);
    });
  });

  // ===== getAllPublicEvents =====

  describe("getAllPublicEvents", () => {
    test("returns aktivitaet events", async () => {
      await db.saveCalendarEvent(eventInput({ eventType: "aktivitaet" }));
      const events = await db.getAllPublicEvents();
      expect(events).toHaveLength(1);
    });

    test("returns lager events", async () => {
      await db.saveCalendarEvent(eventInput({ eventType: "lager" }));
      const events = await db.getAllPublicEvents();
      expect(events).toHaveLength(1);
    });

    test("excludes leitersitzung", async () => {
      await db.saveCalendarEvent(eventInput({ title: "A", eventType: "aktivitaet" }));
      await db.saveCalendarEvent(eventInput({ title: "S", eventType: "leitersitzung" }));
      await db.saveCalendarEvent(eventInput({ title: "L", eventType: "lager" }));

      const events = await db.getAllPublicEvents();
      expect(events).toHaveLength(2);
      expect(events.map((e) => e.title).sort()).toEqual(["A", "L"]);
    });

    test("treats events without eventType as aktivitaet (backwards compat)", async () => {
      // Save an event without eventType — simulates legacy data
      await db.saveCalendarEvent(eventInput({ title: "Legacy" }));
      const events = await db.getAllPublicEvents();
      expect(events).toHaveLength(1);
      expect(events[0].title).toBe("Legacy");
    });

    test("sorts by date then startTime", async () => {
      await db.saveCalendarEvent(eventInput({ title: "B", date: "2026-07-01" }));
      await db.saveCalendarEvent(eventInput({ title: "A", date: "2026-06-01" }));
      const events = await db.getAllPublicEvents();
      expect(events.map((e) => e.title)).toEqual(["A", "B"]);
    });
  });

  // ===== getEventsByGroup =====

  describe("getEventsByGroup", () => {
    test("returns events matching the group slug", async () => {
      await db.saveCalendarEvent(eventInput({ title: "W", groups: ["woelfli"] }));
      await db.saveCalendarEvent(eventInput({ title: "P", groups: ["pfadi"] }));

      const events = await db.getEventsByGroup("woelfli");
      expect(events).toHaveLength(1);
      expect(events[0].title).toBe("W");
    });

    test("includes allGroups events", async () => {
      await db.saveCalendarEvent(eventInput({ title: "All", groups: [], allGroups: true }));
      await db.saveCalendarEvent(eventInput({ title: "Specific", groups: ["woelfli"] }));

      const events = await db.getEventsByGroup("woelfli");
      expect(events).toHaveLength(2);
    });

    test("excludes leitersitzung", async () => {
      await db.saveCalendarEvent(
        eventInput({ title: "Activity", groups: ["woelfli"], eventType: "aktivitaet" })
      );
      await db.saveCalendarEvent(
        eventInput({ title: "Meeting", groups: ["woelfli"], eventType: "leitersitzung" })
      );

      const events = await db.getEventsByGroup("woelfli");
      expect(events).toHaveLength(1);
      expect(events[0].title).toBe("Activity");
    });

    test("excludes allGroups leitersitzung", async () => {
      await db.saveCalendarEvent(
        eventInput({ title: "Global Meeting", groups: [], allGroups: true, eventType: "leitersitzung" })
      );

      const events = await db.getEventsByGroup("woelfli");
      expect(events).toHaveLength(0);
    });

    test("excludes events from other groups", async () => {
      await db.saveCalendarEvent(eventInput({ groups: ["pfadi"] }));
      const events = await db.getEventsByGroup("woelfli");
      expect(events).toHaveLength(0);
    });
  });

  // ===== getNextUpcomingEvent =====

  describe("getNextUpcomingEvent", () => {
    beforeEach(() => {
      // Fix time to 2025-06-15 12:00:00 UTC (= 14:00 Zurich CEST)
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test("returns the chronologically first future event for the group", async () => {
      await db.saveCalendarEvent(
        eventInput({ title: "Later", date: "2025-07-01", groups: ["woelfli"] })
      );
      await db.saveCalendarEvent(
        eventInput({ title: "Sooner", date: "2025-06-20", groups: ["woelfli"] })
      );

      const next = await db.getNextUpcomingEvent("woelfli");
      expect(next?.title).toBe("Sooner");
    });

    test("excludes past events", async () => {
      await db.saveCalendarEvent(
        eventInput({ title: "Past", date: "2024-01-01", groups: ["woelfli"] })
      );
      const next = await db.getNextUpcomingEvent("woelfli");
      expect(next).toBeNull();
    });

    test("includes same-day events still in progress", async () => {
      // endTime 17:00 > nowTime 14:00 → still ongoing
      await db.saveCalendarEvent(
        eventInput({
          title: "Today",
          date: "2025-06-15",
          startTime: "10:00",
          endTime: "17:00",
          groups: ["woelfli"],
        })
      );
      const next = await db.getNextUpcomingEvent("woelfli");
      expect(next?.title).toBe("Today");
    });

    test("excludes same-day events already ended", async () => {
      // endTime 13:00 < nowTime 14:00 → already over
      await db.saveCalendarEvent(
        eventInput({
          title: "Done",
          date: "2025-06-15",
          startTime: "10:00",
          endTime: "13:00",
          groups: ["woelfli"],
        })
      );
      const next = await db.getNextUpcomingEvent("woelfli");
      expect(next).toBeNull();
    });

    test("excludes leitersitzung", async () => {
      await db.saveCalendarEvent(
        eventInput({
          title: "Meeting",
          date: "2025-07-01",
          groups: ["woelfli"],
          eventType: "leitersitzung",
        })
      );
      const next = await db.getNextUpcomingEvent("woelfli");
      expect(next).toBeNull();
    });

    test("returns null when no upcoming events exist", async () => {
      const next = await db.getNextUpcomingEvent("woelfli");
      expect(next).toBeNull();
    });

    test("matches allGroups events", async () => {
      await db.saveCalendarEvent(
        eventInput({
          title: "Global",
          date: "2025-07-01",
          groups: [],
          allGroups: true,
        })
      );
      const next = await db.getNextUpcomingEvent("woelfli");
      expect(next?.title).toBe("Global");
    });

    test("does not match events from other groups", async () => {
      await db.saveCalendarEvent(
        eventInput({ title: "Other", date: "2025-07-01", groups: ["pfadi"] })
      );
      const next = await db.getNextUpcomingEvent("woelfli");
      expect(next).toBeNull();
    });
  });

  // ===== getAllUpcomingEvents =====

  describe("getAllUpcomingEvents", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test("returns future events sorted", async () => {
      await db.saveCalendarEvent(eventInput({ title: "B", date: "2025-08-01" }));
      await db.saveCalendarEvent(eventInput({ title: "A", date: "2025-07-01" }));

      const events = await db.getAllUpcomingEvents();
      expect(events.map((e) => e.title)).toEqual(["A", "B"]);
    });

    test("excludes past events", async () => {
      await db.saveCalendarEvent(eventInput({ date: "2024-01-01" }));
      const events = await db.getAllUpcomingEvents();
      expect(events).toHaveLength(0);
    });

    test("excludes leitersitzung", async () => {
      await db.saveCalendarEvent(
        eventInput({ title: "A", date: "2025-07-01", eventType: "aktivitaet" })
      );
      await db.saveCalendarEvent(
        eventInput({ title: "S", date: "2025-07-01", eventType: "leitersitzung" })
      );

      const events = await db.getAllUpcomingEvents();
      expect(events).toHaveLength(1);
      expect(events[0].title).toBe("A");
    });
  });

  // ===== getAllEventsForLeiter =====

  describe("getAllEventsForLeiter", () => {
    test("returns ALL events including leitersitzung", async () => {
      await db.saveCalendarEvent(eventInput({ title: "A", eventType: "aktivitaet" }));
      await db.saveCalendarEvent(eventInput({ title: "L", eventType: "lager" }));
      await db.saveCalendarEvent(eventInput({ title: "S", eventType: "leitersitzung" }));

      const events = await db.getAllEventsForLeiter();
      expect(events).toHaveLength(3);
    });

    test("includes past events (for calendar subscriptions)", async () => {
      await db.saveCalendarEvent(eventInput({ date: "2020-01-01" }));
      await db.saveCalendarEvent(eventInput({ date: "2030-01-01" }));

      const events = await db.getAllEventsForLeiter();
      expect(events).toHaveLength(2);
    });

    test("sorts by date then startTime", async () => {
      await db.saveCalendarEvent(eventInput({ title: "C", date: "2026-03-01" }));
      await db.saveCalendarEvent(eventInput({ title: "A", date: "2026-01-01" }));
      await db.saveCalendarEvent(eventInput({ title: "B", date: "2026-02-01" }));

      const events = await db.getAllEventsForLeiter();
      expect(events.map((e) => e.title)).toEqual(["A", "B", "C"]);
    });
  });

  // ===== getEventsForLeiterByGroup =====

  describe("getEventsForLeiterByGroup", () => {
    test("returns events for the specified group", async () => {
      await db.saveCalendarEvent(eventInput({ title: "W", groups: ["woelfli"] }));
      await db.saveCalendarEvent(eventInput({ title: "P", groups: ["pfadi"] }));

      const events = await db.getEventsForLeiterByGroup("woelfli");
      expect(events).toHaveLength(1);
      expect(events[0].title).toBe("W");
    });

    test("includes allGroups events", async () => {
      await db.saveCalendarEvent(
        eventInput({ title: "Global", groups: [], allGroups: true })
      );
      const events = await db.getEventsForLeiterByGroup("woelfli");
      expect(events).toHaveLength(1);
      expect(events[0].title).toBe("Global");
    });

    test("includes leitersitzung events (unlike kid feeds)", async () => {
      await db.saveCalendarEvent(
        eventInput({
          title: "Meeting",
          groups: ["woelfli"],
          eventType: "leitersitzung",
        })
      );
      const events = await db.getEventsForLeiterByGroup("woelfli");
      expect(events).toHaveLength(1);
      expect(events[0].title).toBe("Meeting");
    });

    test("includes allGroups leitersitzung", async () => {
      await db.saveCalendarEvent(
        eventInput({
          title: "Global Meeting",
          groups: [],
          allGroups: true,
          eventType: "leitersitzung",
        })
      );
      const events = await db.getEventsForLeiterByGroup("woelfli");
      expect(events).toHaveLength(1);
    });

    test("excludes events from other groups", async () => {
      await db.saveCalendarEvent(eventInput({ groups: ["pfadi"] }));
      const events = await db.getEventsForLeiterByGroup("woelfli");
      expect(events).toHaveLength(0);
    });

    test("includes past events (for calendar subscriptions)", async () => {
      await db.saveCalendarEvent(
        eventInput({ date: "2020-01-01", groups: ["woelfli"] })
      );
      const events = await db.getEventsForLeiterByGroup("woelfli");
      expect(events).toHaveLength(1);
    });

    test("sorts by date then startTime", async () => {
      await db.saveCalendarEvent(
        eventInput({ title: "B", date: "2026-02-01", groups: ["woelfli"] })
      );
      await db.saveCalendarEvent(
        eventInput({ title: "A", date: "2026-01-01", groups: ["woelfli"] })
      );
      const events = await db.getEventsForLeiterByGroup("woelfli");
      expect(events.map((e) => e.title)).toEqual(["A", "B"]);
    });
  });

  // ===== Cross-cutting: leitersitzung isolation =====

  describe("leitersitzung isolation", () => {
    test("leitersitzung excluded from all kid-facing methods but included in leiter methods", async () => {
      // Set up fake time for upcoming-event methods
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));

      try {
        const futureDate = "2025-12-01";
        await db.saveCalendarEvent(
          eventInput({
            title: "Sitzung",
            date: futureDate,
            groups: ["woelfli"],
            allGroups: false,
            eventType: "leitersitzung",
          })
        );

        // Kid-facing: all should return 0
        expect(await db.getAllPublicEvents()).toHaveLength(0);
        expect(await db.getEventsByGroup("woelfli")).toHaveLength(0);
        expect(await db.getNextUpcomingEvent("woelfli")).toBeNull();
        expect(await db.getAllUpcomingEvents()).toHaveLength(0);

        // Leiter-facing: all should return 1
        expect(await db.getAllEventsForLeiter()).toHaveLength(1);
        expect(await db.getEventsForLeiterByGroup("woelfli")).toHaveLength(1);

        // Admin: should return 1
        expect(await db.getCalendarEvents()).toHaveLength(1);
      } finally {
        vi.useRealTimers();
      }
    });
  });
});
