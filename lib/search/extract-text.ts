import type { PageData } from "@lib/config/page.config";

export type SearchSegment = {
  text: string;
  componentId: string;
  weight: number;
};

export type SearchIndexEntry = {
  path: string;
  title: string;
  text: string;
  componentId: string;
  weight: number;
};

interface ComponentEntry {
  type: string;
  props: { id: string; [key: string]: unknown };
}

const HEADING_WEIGHTS: Record<string, number> = {
  h1: 3,
  h2: 2.5,
  h3: 2,
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getComponentWeight(component: ComponentEntry): number {
  if (component.type === "Hero") return 3;
  if (component.type === "RichText") return 1.5;
  if (component.type === "Heading") {
    const level = component.props.level as string | undefined;
    return (level && HEADING_WEIGHTS[level]) || 1;
  }
  return 1;
}

function extractRichTextSegments(
  component: ComponentEntry,
): SearchSegment[] {
  const content = component.props.content;
  if (typeof content !== "string") return [];

  const segments: SearchSegment[] = [];
  const headingPattern = /<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi;

  for (const match of content.matchAll(headingPattern)) {
    const tag = match[1].toLowerCase();
    const text = stripHtml(match[2]);
    if (text) {
      segments.push({
        text,
        componentId: component.props.id,
        weight: HEADING_WEIGHTS[tag] ?? 1,
      });
    }
  }

  const bodyText = stripHtml(content);
  if (bodyText) {
    segments.push({
      text: bodyText,
      componentId: component.props.id,
      weight: 1,
    });
  }

  return segments;
}

function formatGermanDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function extractLocationName(loc: unknown): string | null {
  if (loc && typeof loc === "object" && "name" in loc) {
    const name = (loc as { name?: unknown }).name;
    if (typeof name === "string" && name.trim()) return name;
  }
  return null;
}

function extractTextFromComponent(component: ComponentEntry): string {
  const parts: string[] = [];
  const props = component.props;

  if (typeof props.text === "string" && props.text) parts.push(props.text);
  if (typeof props.title === "string" && props.title) parts.push(props.title);
  if (typeof props.label === "string" && props.label) parts.push(props.label);
  if (typeof props.description === "string" && props.description) parts.push(props.description);

  if (typeof props.content === "string" && props.content) {
    parts.push(stripHtml(props.content));
  }

  if (typeof props.date === "string" && props.date) {
    try {
      parts.push(formatGermanDate(props.date));
    } catch {
      parts.push(props.date);
    }
  }
  if (typeof props.bemerkung === "string" && props.bemerkung) {
    parts.push(props.bemerkung);
  }
  const locName = extractLocationName(props.location);
  if (locName) parts.push(locName);
  const endLocName = extractLocationName(props.endLocation);
  if (endLocName) parts.push(endLocName);
  if (Array.isArray(props.mitnehmen)) {
    for (const item of props.mitnehmen) {
      if (item && typeof item === "object" && "name" in item && typeof item.name === "string" && item.name) {
        parts.push(item.name);
      }
    }
  }

  if (Array.isArray(props.buttons)) {
    for (const btn of props.buttons) {
      if (btn && typeof btn === "object" && "content" in btn && typeof btn.content === "string" && btn.content) {
        parts.push(btn.content);
      }
    }
  }

  if (Array.isArray(props.images)) {
    for (const img of props.images) {
      if (img && typeof img === "object" && "alt" in img && typeof img.alt === "string" && img.alt) {
        parts.push(img.alt);
      }
    }
  }

  if (typeof props.formTitle === "string" && props.formTitle) parts.push(props.formTitle);
  if (typeof props.submitButtonText === "string" && props.submitButtonText) parts.push(props.submitButtonText);
  if (typeof props.successMessage === "string" && props.successMessage) parts.push(props.successMessage);
  if (Array.isArray(props.fields)) {
    for (const field of props.fields) {
      if (field && typeof field === "object") {
        if ("label" in field && typeof field.label === "string" && field.label) {
          parts.push(field.label);
        }
        if ("placeholder" in field && typeof field.placeholder === "string" && field.placeholder) {
          parts.push(field.placeholder);
        }
        if ("options" in field && typeof field.options === "string" && field.options) {
          parts.push(field.options);
        }
      }
    }
  }

  if (typeof props.heading === "string" && props.heading) parts.push(props.heading);
  if (Array.isArray(props.links)) {
    for (const link of props.links) {
      if (link && typeof link === "object" && "label" in link && typeof link.label === "string" && link.label) {
        parts.push(link.label);
      }
    }
  }

  return parts.join(" ");
}

export function extractSearchableText(data: PageData): string {
  return extractSearchableSegments(data)
    .map((s) => s.text)
    .join(" ");
}

function processComponent(
  component: ComponentEntry,
  segments: SearchSegment[],
): void {
  if (component.type === "RichText") {
    segments.push(...extractRichTextSegments(component));
    return;
  }

  const text = extractTextFromComponent(component);
  if (text) {
    segments.push({
      text,
      componentId: component.props.id,
      weight: getComponentWeight(component),
    });
  }
}

export function extractSearchableSegments(data: PageData): SearchSegment[] {
  const segments: SearchSegment[] = [];

  for (const component of data.content) {
    processComponent(component as ComponentEntry, segments);
  }

  if (data.zones) {
    for (const zoneContent of Object.values(data.zones)) {
      if (!Array.isArray(zoneContent)) continue;
      for (const component of zoneContent) {
        processComponent(component as ComponentEntry, segments);
      }
    }
  }

  return segments;
}
