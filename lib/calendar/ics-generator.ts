import type { CalendarEvent } from "./types";

/**
 * Escapes special characters in ICS text fields per RFC 5545.
 * Backslashes, semicolons, commas, and newlines must be escaped.
 */
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Folds long lines per RFC 5545 (max 75 octets per line).
 * Continuation lines start with a space.
 * Uses TextEncoder to count UTF-8 byte length correctly.
 */
function foldLine(line: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(line);
  const maxBytes = 75;
  if (bytes.length <= maxBytes) return line;

  const parts: string[] = [];
  let offset = 0;

  // First line: up to 75 bytes
  let charCount = 0;
  let byteCount = 0;
  while (charCount < line.length) {
    const charBytes = encoder.encode(line[charCount]).length;
    if (byteCount + charBytes > maxBytes) break;
    byteCount += charBytes;
    charCount++;
  }
  parts.push(line.slice(0, charCount));
  offset = charCount;

  // Continuation lines: space (1 byte) + up to 74 bytes of content
  while (offset < line.length) {
    charCount = 0;
    byteCount = 0;
    const contMax = maxBytes - 1; // 1 byte for leading space
    while (offset + charCount < line.length) {
      const charBytes = encoder.encode(line[offset + charCount]).length;
      if (byteCount + charBytes > contMax) break;
      byteCount += charBytes;
      charCount++;
    }
    parts.push(" " + line.slice(offset, offset + charCount));
    offset += charCount;
  }

  return parts.join("\r\n");
}

/**
 * Formats a date string ("YYYY-MM-DD") and time string ("HH:MM") into
 * an ICS DTSTART/DTEND value with TZID=Europe/Zurich.
 * Output: "YYYYMMDDTHHMMSS"
 */
function formatIcsDateTime(date: string, time: string): string {
  const [year, month, day] = date.split("-");
  const [hour, minute] = time.split(":");
  return `${year}${month}${day}T${hour}${minute}00`;
}

/**
 * Formats an ISO date string to ICS DTSTAMP format (UTC).
 * Output: "YYYYMMDDTHHMMSSZ"
 */
function formatIcsDtstamp(isoString: string): string {
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

/**
 * Builds the DESCRIPTION field from event details.
 * Includes packing list and remark if present.
 */
function buildDescription(event: CalendarEvent): string {
  const parts: string[] = [];

  if (event.description) {
    parts.push(event.description);
  }

  if (event.mitnehmen?.length > 0) {
    const items = event.mitnehmen
      .filter((m) => m.name?.trim())
      .map((m) => m.name.trim());
    if (items.length > 0) {
      parts.push(`Mitnehmen: ${items.join(", ")}`);
    }
  }

  if (event.bemerkung?.trim()) {
    parts.push(`Bemerkung: ${event.bemerkung.trim()}`);
  }

  return parts.join("\n");
}

/**
 * Builds a LOCATION string from location info.
 */
function buildLocation(event: CalendarEvent): string {
  const parts: string[] = [];

  if (event.location?.name?.trim()) {
    parts.push(event.location.name.trim());
  }

  if (event.endLocation?.name?.trim()) {
    parts.push(`Endort: ${event.endLocation.name.trim()}`);
  }

  return parts.join(" | ");
}

/**
 * Generates a single VEVENT block for an event.
 */
function generateVevent(event: CalendarEvent): string {
  const lines: string[] = [];
  lines.push("BEGIN:VEVENT");
  lines.push(`UID:${event.uid}`);
  lines.push(`DTSTAMP:${formatIcsDtstamp(event.updatedAt)}`);
  lines.push(
    `DTSTART;TZID=Europe/Zurich:${formatIcsDateTime(event.date, event.startTime)}`
  );
  lines.push(
    `DTEND;TZID=Europe/Zurich:${formatIcsDateTime(event.date, event.endTime)}`
  );
  lines.push(`SUMMARY:${escapeIcsText(event.title)}`);

  const description = buildDescription(event);
  if (description) {
    lines.push(`DESCRIPTION:${escapeIcsText(description)}`);
  }

  const location = buildLocation(event);
  if (location) {
    lines.push(`LOCATION:${escapeIcsText(location)}`);
  }

  lines.push(`LAST-MODIFIED:${formatIcsDtstamp(event.updatedAt)}`);
  lines.push(`CREATED:${formatIcsDtstamp(event.createdAt)}`);
  lines.push("END:VEVENT");

  return lines.map(foldLine).join("\r\n");
}

/**
 * VTIMEZONE definition for Europe/Zurich.
 * Covers CET (UTC+1) and CEST (UTC+2) transitions.
 */
const VTIMEZONE_EUROPE_ZURICH = [
  "BEGIN:VTIMEZONE",
  "TZID:Europe/Zurich",
  "BEGIN:STANDARD",
  "DTSTART:19701025T030000",
  "RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=10",
  "TZOFFSETFROM:+0200",
  "TZOFFSETTO:+0100",
  "TZNAME:CET",
  "END:STANDARD",
  "BEGIN:DAYLIGHT",
  "DTSTART:19700329T020000",
  "RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=3",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0200",
  "TZNAME:CEST",
  "END:DAYLIGHT",
  "END:VTIMEZONE",
].join("\r\n");

/**
 * Generates a complete ICS calendar feed from a list of events.
 *
 * @param events - The calendar events to include
 * @param calendarName - Display name for the calendar (e.g. "Pfadi MH - Wölfli")
 * @returns Valid RFC 5545 ICS content string
 */
export function generateIcsFeed(
  events: CalendarEvent[],
  calendarName: string
): string {
  const lines: string[] = [];
  lines.push("BEGIN:VCALENDAR");
  lines.push("VERSION:2.0");
  lines.push("PRODID:-//PfadiMH//Calendar//DE");
  lines.push("CALSCALE:GREGORIAN");
  lines.push("METHOD:PUBLISH");
  lines.push(`X-WR-CALNAME:${escapeIcsText(calendarName)}`);
  lines.push("X-WR-TIMEZONE:Europe/Zurich");

  const header = lines.map(foldLine).join("\r\n");
  const vevents = events.map(generateVevent).join("\r\n");
  const footer = "END:VCALENDAR";

  const parts = [header, VTIMEZONE_EUROPE_ZURICH];
  if (vevents) parts.push(vevents);
  parts.push(footer);

  return parts.join("\r\n") + "\r\n";
}
