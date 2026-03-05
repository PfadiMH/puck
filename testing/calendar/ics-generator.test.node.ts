import { generateIcsFeed } from "@lib/calendar/ics-generator";
import type { CalendarEvent } from "@lib/calendar/types";
import { describe, expect, test } from "vitest";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createEvent(overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  return {
    _id: "test-id-1",
    uid: "event-test-id-1@pfadimh.ch",
    title: "Test Event",
    date: "2025-06-15",
    startTime: "14:00",
    endTime: "17:00",
    groups: ["woelfli"],
    allGroups: false,
    mitnehmen: [],
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-06-01T12:00:00.000Z",
    ...overrides,
  };
}

/** Unfold ICS continuation lines (CRLF + space/tab → join) */
function unfold(ics: string): string {
  return ics.replace(/\r\n[ \t]/g, "");
}

/** Parse unfolded ICS into non-empty lines */
function lines(ics: string): string[] {
  return unfold(ics).split("\r\n").filter(Boolean);
}

/** Find the first line starting with a given prefix */
function prop(icsLines: string[], prefix: string): string | undefined {
  return icsLines.find((l) => l.startsWith(prefix));
}

/** Extract all lines between BEGIN:VEVENT and END:VEVENT for the Nth event (0-indexed) */
function veventLines(icsLines: string[], index = 0): string[] {
  const blocks: string[][] = [];
  let current: string[] | null = null;
  for (const line of icsLines) {
    if (line === "BEGIN:VEVENT") {
      current = [];
    } else if (line === "END:VEVENT") {
      if (current) blocks.push(current);
      current = null;
    } else if (current) {
      current.push(line);
    }
  }
  return blocks[index] ?? [];
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("generateIcsFeed", () => {
  // ----- Feed structure -----

  describe("feed structure", () => {
    const ics = generateIcsFeed([], "Test Calendar");
    const l = lines(ics);

    test("starts with BEGIN:VCALENDAR", () => {
      expect(l[0]).toBe("BEGIN:VCALENDAR");
    });

    test("ends with END:VCALENDAR", () => {
      expect(l[l.length - 1]).toBe("END:VCALENDAR");
    });

    test("contains VERSION:2.0", () => {
      expect(l).toContain("VERSION:2.0");
    });

    test("contains PRODID", () => {
      expect(prop(l, "PRODID:")).toBe("PRODID:-//PfadiMH//Calendar//DE");
    });

    test("contains CALSCALE:GREGORIAN", () => {
      expect(l).toContain("CALSCALE:GREGORIAN");
    });

    test("contains METHOD:PUBLISH", () => {
      expect(l).toContain("METHOD:PUBLISH");
    });

    test("sets X-WR-CALNAME to the calendar name", () => {
      expect(prop(l, "X-WR-CALNAME:")).toBe("X-WR-CALNAME:Test Calendar");
    });

    test("sets X-WR-TIMEZONE to Europe/Zurich", () => {
      expect(prop(l, "X-WR-TIMEZONE:")).toBe("X-WR-TIMEZONE:Europe/Zurich");
    });

    test("includes VTIMEZONE block for Europe/Zurich", () => {
      expect(l).toContain("BEGIN:VTIMEZONE");
      expect(l).toContain("TZID:Europe/Zurich");
      expect(l).toContain("END:VTIMEZONE");
    });

    test("includes CET standard and CEST daylight sub-components", () => {
      expect(l).toContain("BEGIN:STANDARD");
      expect(l).toContain("TZNAME:CET");
      expect(l).toContain("END:STANDARD");
      expect(l).toContain("BEGIN:DAYLIGHT");
      expect(l).toContain("TZNAME:CEST");
      expect(l).toContain("END:DAYLIGHT");
    });

    test("uses CRLF line endings throughout", () => {
      // Every line break in the raw output should be \r\n
      const withoutCrlf = ics.replace(/\r\n/g, "");
      expect(withoutCrlf).not.toContain("\n");
      expect(withoutCrlf).not.toContain("\r");
    });

    test("ends with CRLF", () => {
      expect(ics.endsWith("\r\n")).toBe(true);
    });
  });

  // ----- Empty feed -----

  describe("empty events list", () => {
    test("produces valid feed with no VEVENT blocks", () => {
      const ics = generateIcsFeed([], "Empty");
      const l = lines(ics);
      expect(l).toContain("BEGIN:VCALENDAR");
      expect(l).toContain("END:VCALENDAR");
      expect(l).not.toContain("BEGIN:VEVENT");
      expect(l).not.toContain("END:VEVENT");
    });
  });

  // ----- VEVENT generation -----

  describe("VEVENT generation", () => {
    const event = createEvent();
    const ics = generateIcsFeed([event], "Cal");
    const l = lines(ics);
    const ve = veventLines(l);

    test("wraps event in BEGIN/END:VEVENT", () => {
      expect(l).toContain("BEGIN:VEVENT");
      expect(l).toContain("END:VEVENT");
    });

    test("sets UID from event", () => {
      expect(ve).toContain("UID:event-test-id-1@pfadimh.ch");
    });

    test("formats DTSTART with TZID=Europe/Zurich", () => {
      expect(prop(ve, "DTSTART")).toBe(
        "DTSTART;TZID=Europe/Zurich:20250615T140000"
      );
    });

    test("formats DTEND with TZID=Europe/Zurich", () => {
      expect(prop(ve, "DTEND")).toBe(
        "DTEND;TZID=Europe/Zurich:20250615T170000"
      );
    });

    test("sets SUMMARY to event title", () => {
      expect(ve).toContain("SUMMARY:Test Event");
    });

    test("formats DTSTAMP as UTC from updatedAt", () => {
      // updatedAt: "2025-06-01T12:00:00.000Z" → "20250601T120000Z"
      expect(ve).toContain("DTSTAMP:20250601T120000Z");
    });

    test("formats CREATED from createdAt", () => {
      // createdAt: "2025-01-01T00:00:00.000Z" → "20250101T000000Z"
      expect(ve).toContain("CREATED:20250101T000000Z");
    });

    test("formats LAST-MODIFIED from updatedAt", () => {
      expect(ve).toContain("LAST-MODIFIED:20250601T120000Z");
    });
  });

  // ----- Multiple events -----

  describe("multiple events", () => {
    test("generates a VEVENT block for each event", () => {
      const events = [
        createEvent({ _id: "a", uid: "event-a@pfadimh.ch", title: "Alpha" }),
        createEvent({ _id: "b", uid: "event-b@pfadimh.ch", title: "Beta" }),
        createEvent({ _id: "c", uid: "event-c@pfadimh.ch", title: "Gamma" }),
      ];
      const ics = generateIcsFeed(events, "Multi");
      const l = lines(ics);

      const beginCount = l.filter((x) => x === "BEGIN:VEVENT").length;
      const endCount = l.filter((x) => x === "END:VEVENT").length;
      expect(beginCount).toBe(3);
      expect(endCount).toBe(3);

      expect(veventLines(l, 0)).toContain("SUMMARY:Alpha");
      expect(veventLines(l, 1)).toContain("SUMMARY:Beta");
      expect(veventLines(l, 2)).toContain("SUMMARY:Gamma");
    });
  });

  // ----- Text escaping -----

  describe("text escaping", () => {
    test("escapes backslashes in SUMMARY", () => {
      const ics = generateIcsFeed(
        [createEvent({ title: "Back\\slash" })],
        "Cal"
      );
      const ve = veventLines(lines(ics));
      expect(ve).toContain("SUMMARY:Back\\\\slash");
    });

    test("escapes semicolons in SUMMARY", () => {
      const ics = generateIcsFeed(
        [createEvent({ title: "Semi;colon" })],
        "Cal"
      );
      const ve = veventLines(lines(ics));
      expect(ve).toContain("SUMMARY:Semi\\;colon");
    });

    test("escapes commas in SUMMARY", () => {
      const ics = generateIcsFeed(
        [createEvent({ title: "One, Two, Three" })],
        "Cal"
      );
      const ve = veventLines(lines(ics));
      expect(ve).toContain("SUMMARY:One\\, Two\\, Three");
    });

    test("escapes newlines in DESCRIPTION", () => {
      const ics = generateIcsFeed(
        [createEvent({ description: "Line1\nLine2" })],
        "Cal"
      );
      const ve = veventLines(lines(ics));
      const desc = prop(ve, "DESCRIPTION:");
      expect(desc).toContain("Line1\\nLine2");
    });

    test("normalizes CRLF to escaped \\n", () => {
      const ics = generateIcsFeed(
        [createEvent({ description: "A\r\nB" })],
        "Cal"
      );
      const ve = veventLines(lines(ics));
      const desc = prop(ve, "DESCRIPTION:");
      expect(desc).toContain("A\\nB");
    });

    test("escapes special chars in calendar name", () => {
      const ics = generateIcsFeed([], "Pfadi MH, Zürich; Events");
      const l = lines(ics);
      expect(prop(l, "X-WR-CALNAME:")).toBe(
        "X-WR-CALNAME:Pfadi MH\\, Zürich\\; Events"
      );
    });

    test("escapes combined special characters", () => {
      const ics = generateIcsFeed(
        [createEvent({ title: "A\\B;C,D\nE" })],
        "Cal"
      );
      const ve = veventLines(lines(ics));
      expect(ve).toContain("SUMMARY:A\\\\B\\;C\\,D\\nE");
    });
  });

  // ----- Line folding -----

  describe("line folding", () => {
    test("does not fold short lines", () => {
      const event = createEvent({ title: "Short" });
      const raw = generateIcsFeed([event], "Cal");
      // Find the raw SUMMARY line (before unfolding)
      const rawLines = raw.split("\r\n");
      const summaryLine = rawLines.find((l) => l.startsWith("SUMMARY:"));
      expect(summaryLine).toBe("SUMMARY:Short");
    });

    test("folds lines exceeding 75 bytes", () => {
      // "SUMMARY:" is 8 bytes. Use a 70-char ASCII title → 78 bytes total → needs folding
      const longTitle = "A".repeat(70);
      const raw = generateIcsFeed([createEvent({ title: longTitle })], "Cal");

      // The raw output should contain a continuation line (starting with space)
      const rawLines = raw.split("\r\n");
      const summaryIdx = rawLines.findIndex((l) => l.startsWith("SUMMARY:"));
      expect(summaryIdx).toBeGreaterThan(-1);

      // Next line should be a continuation (starts with space)
      expect(rawLines[summaryIdx + 1]?.[0]).toBe(" ");

      // After unfolding, the full SUMMARY should be intact
      const ve = veventLines(lines(raw));
      expect(ve).toContain(`SUMMARY:${longTitle}`);
    });

    test("handles UTF-8 multibyte characters without splitting them", () => {
      // "ä" is 2 bytes in UTF-8. Create a title where byte boundary falls on a char
      // "SUMMARY:" = 8 bytes. 33 × "ä" = 66 bytes → total 74 bytes (fits)
      // 34 × "ä" = 68 bytes → total 76 bytes (needs fold)
      const title = "ä".repeat(34);
      const raw = generateIcsFeed([createEvent({ title: title })], "Cal");

      // After unfolding, the title must be fully preserved
      const ve = veventLines(lines(raw));
      expect(ve).toContain(`SUMMARY:${title}`);

      // No raw line should exceed 75 bytes
      const encoder = new TextEncoder();
      for (const line of raw.split("\r\n")) {
        expect(encoder.encode(line).length).toBeLessThanOrEqual(75);
      }
    });

    test("no raw line exceeds 75 bytes for long mixed content", () => {
      const event = createEvent({
        title: "Pfadi Sommerlager 2025 in den wunderschönen Schweizer Bergen mit Übernachtung",
        description:
          "Ein tolles Abenteuer für alle Pfadis! Wir werden wandern, klettern, schwimmen und am Lagerfeuer sitzen.",
        location: { name: "Pfadiheim Zürich-Oberland, Rapperswil-Jona" },
        bemerkung: "Bitte Sonnencreme und Regenjacke mitbringen; bei Fragen, einfach melden!",
        mitnehmen: [
          { name: "Schlafsack" },
          { name: "Wanderschuhe" },
          { name: "Trinkflasche" },
        ],
      });
      const raw = generateIcsFeed([event], "Pfadi MH - Sommerlager");
      const encoder = new TextEncoder();
      for (const line of raw.split("\r\n")) {
        expect(encoder.encode(line).length).toBeLessThanOrEqual(75);
      }
    });
  });

  // ----- Description building -----

  describe("description building", () => {
    test("omits DESCRIPTION when event has no description, mitnehmen, or bemerkung", () => {
      const ve = veventLines(lines(generateIcsFeed([createEvent()], "Cal")));
      expect(prop(ve, "DESCRIPTION:")).toBeUndefined();
    });

    test("includes event description", () => {
      const ve = veventLines(
        lines(
          generateIcsFeed(
            [createEvent({ description: "Details here" })],
            "Cal"
          )
        )
      );
      expect(prop(ve, "DESCRIPTION:")).toBe("DESCRIPTION:Details here");
    });

    test("includes mitnehmen items", () => {
      const ve = veventLines(
        lines(
          generateIcsFeed(
            [
              createEvent({
                mitnehmen: [
                  { name: "Schlafsack" },
                  { name: "Taschenlampe" },
                ],
              }),
            ],
            "Cal"
          )
        )
      );
      const desc = prop(ve, "DESCRIPTION:");
      expect(desc).toContain("Mitnehmen: Schlafsack\\, Taschenlampe");
    });

    test("includes bemerkung", () => {
      const ve = veventLines(
        lines(
          generateIcsFeed(
            [createEvent({ bemerkung: "Achtung Baustelle" })],
            "Cal"
          )
        )
      );
      const desc = prop(ve, "DESCRIPTION:");
      expect(desc).toContain("Bemerkung: Achtung Baustelle");
    });

    test("combines description, mitnehmen, and bemerkung with escaped newlines", () => {
      const ve = veventLines(
        lines(
          generateIcsFeed(
            [
              createEvent({
                description: "Fun day",
                mitnehmen: [{ name: "Snack" }],
                bemerkung: "Be on time",
              }),
            ],
            "Cal"
          )
        )
      );
      const desc = prop(ve, "DESCRIPTION:");
      expect(desc).toBe(
        "DESCRIPTION:Fun day\\nMitnehmen: Snack\\nBemerkung: Be on time"
      );
    });

    test("filters out mitnehmen items with empty names", () => {
      const ve = veventLines(
        lines(
          generateIcsFeed(
            [
              createEvent({
                mitnehmen: [
                  { name: "Valid" },
                  { name: "" },
                  { name: "  " },
                  { name: "Also Valid" },
                ],
              }),
            ],
            "Cal"
          )
        )
      );
      const desc = prop(ve, "DESCRIPTION:");
      expect(desc).toBe("DESCRIPTION:Mitnehmen: Valid\\, Also Valid");
    });

    test("omits mitnehmen section when all items have empty names", () => {
      const ve = veventLines(
        lines(
          generateIcsFeed(
            [createEvent({ mitnehmen: [{ name: "" }, { name: "  " }] })],
            "Cal"
          )
        )
      );
      expect(prop(ve, "DESCRIPTION:")).toBeUndefined();
    });
  });

  // ----- Location building -----

  describe("location building", () => {
    test("omits LOCATION when no location is set", () => {
      const ve = veventLines(lines(generateIcsFeed([createEvent()], "Cal")));
      expect(prop(ve, "LOCATION:")).toBeUndefined();
    });

    test("sets LOCATION from event location name", () => {
      const ve = veventLines(
        lines(
          generateIcsFeed(
            [createEvent({ location: { name: "Pfadiheim" } })],
            "Cal"
          )
        )
      );
      expect(prop(ve, "LOCATION:")).toBe("LOCATION:Pfadiheim");
    });

    test("appends endLocation with separator", () => {
      const ve = veventLines(
        lines(
          generateIcsFeed(
            [
              createEvent({
                location: { name: "Start" },
                endLocation: { name: "Ziel" },
              }),
            ],
            "Cal"
          )
        )
      );
      expect(prop(ve, "LOCATION:")).toBe("LOCATION:Start | Endort: Ziel");
    });

    test("shows only endLocation when start location is missing", () => {
      const ve = veventLines(
        lines(
          generateIcsFeed(
            [createEvent({ endLocation: { name: "Ziel" } })],
            "Cal"
          )
        )
      );
      expect(prop(ve, "LOCATION:")).toBe("LOCATION:Endort: Ziel");
    });

    test("ignores location with empty name", () => {
      const ve = veventLines(
        lines(
          generateIcsFeed(
            [createEvent({ location: { name: "  " } })],
            "Cal"
          )
        )
      );
      expect(prop(ve, "LOCATION:")).toBeUndefined();
    });

    test("escapes special characters in location", () => {
      const ve = veventLines(
        lines(
          generateIcsFeed(
            [
              createEvent({
                location: { name: "Zürich, Bahnhof; Gleis 3" },
              }),
            ],
            "Cal"
          )
        )
      );
      expect(prop(ve, "LOCATION:")).toBe(
        "LOCATION:Zürich\\, Bahnhof\\; Gleis 3"
      );
    });
  });

  // ----- DateTime formatting edge cases -----

  describe("datetime formatting", () => {
    test("handles midnight start time", () => {
      const ics = generateIcsFeed(
        [createEvent({ startTime: "00:00" })],
        "Cal"
      );
      const ve = veventLines(lines(ics));
      expect(prop(ve, "DTSTART")).toBe(
        "DTSTART;TZID=Europe/Zurich:20250615T000000"
      );
    });

    test("handles end-of-day time", () => {
      const ics = generateIcsFeed(
        [createEvent({ endTime: "23:59" })],
        "Cal"
      );
      const ve = veventLines(lines(ics));
      expect(prop(ve, "DTEND")).toBe(
        "DTEND;TZID=Europe/Zurich:20250615T235900"
      );
    });

    test("formats single-digit months and days", () => {
      const ics = generateIcsFeed(
        [createEvent({ date: "2025-01-05" })],
        "Cal"
      );
      const ve = veventLines(lines(ics));
      expect(prop(ve, "DTSTART")).toContain("20250105T");
    });
  });
});
