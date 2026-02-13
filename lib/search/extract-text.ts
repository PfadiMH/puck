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

function extractTextFromComponent(component: ComponentEntry): string {
  const { text, title, content } = component.props;
  const parts: string[] = [];
  if (typeof text === "string") parts.push(text);
  if (typeof title === "string") parts.push(title);
  if (typeof content === "string") parts.push(stripHtml(content));
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
