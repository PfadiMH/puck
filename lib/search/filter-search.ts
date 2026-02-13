import type { SearchIndexEntry } from "@lib/search/extract-text";
import Fuse from "fuse.js";

export type SearchResult = {
  id: string;
  path: string;
  title: string;
  snippet: string;
  componentId: string;
};

export function countOccurrences(text: string, term: string): number {
  const lower = text.toLowerCase();
  const target = term.toLowerCase();
  if (!target) return 0;
  let count = 0;
  let pos = 0;
  while ((pos = lower.indexOf(target, pos)) !== -1) {
    count++;
    pos += target.length;
  }
  return count;
}

export function buildSnippet(text: string, query: string): string {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return text.slice(0, 80);
  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + query.length + 40);
  let snippet = text.slice(start, end);
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";
  return snippet;
}

export function filterSearchIndex(
  index: SearchIndexEntry[],
  query: string,
): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const fuse = new Fuse(index, {
    keys: [
      { name: "title", weight: 2 },
      { name: "text", weight: 1 },
    ],
    threshold: 0.4,
    includeScore: true,
    ignoreLocation: true,
  });

  const terms = trimmed.toLowerCase().split(/\s+/);

  return fuse
    .search(trimmed)
    .filter((result) => {
      const combined = (
        result.item.title +
        " " +
        result.item.text
      ).toLowerCase();
      return terms.every((term) => combined.includes(term));
    })
    .sort((a, b) => {
      const freqA =
        countOccurrences(a.item.title, trimmed) * 2 +
        countOccurrences(a.item.text, trimmed);
      const freqB =
        countOccurrences(b.item.title, trimmed) * 2 +
        countOccurrences(b.item.text, trimmed);
      const scoreA = (a.score ?? 1) / ((1 + freqA) * a.item.weight);
      const scoreB = (b.score ?? 1) / ((1 + freqB) * b.item.weight);
      return scoreA - scoreB;
    })
    .slice(0, 10)
    .map((result, i) => ({
      id: `${result.item.path}-${i}`,
      path: result.item.path,
      title: result.item.title,
      snippet: buildSnippet(result.item.text, trimmed),
      componentId: result.item.componentId,
    }));
}
