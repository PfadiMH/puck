import type { SearchIndexEntry } from "@lib/search/extract-text";
import {
  buildSnippet,
  countOccurrences,
  filterSearchIndex,
} from "@lib/search/filter-search";
import { describe, expect, test } from "vitest";

const sampleIndex: SearchIndexEntry[] = [
  {
    path: "/about",
    title: "About Us",
    text: "we are a scout group based in the city. our activities include hiking camping and crafts.",
    componentId: "c1",
    weight: 1,
  },
  {
    path: "/events",
    title: "Events and Activities",
    text: "upcoming events include the summer camp and the winter hike. join us for fun activities.",
    componentId: "c2",
    weight: 1,
  },
  {
    path: "/contact",
    title: "Contact",
    text: "reach us via email or phone. we are happy to answer your questions.",
    componentId: "c3",
    weight: 1,
  },
  {
    path: "/hiking",
    title: "Hiking Adventures",
    text: "hiking is our favorite activity. we go hiking every weekend in the mountains. hiking trails are beautiful.",
    componentId: "c4",
    weight: 1,
  },
];

describe("filterSearchIndex", () => {
  test("returns empty array for empty query", () => {
    expect(filterSearchIndex(sampleIndex, "")).toEqual([]);
  });

  test("returns empty array for whitespace-only query", () => {
    expect(filterSearchIndex(sampleIndex, "   ")).toEqual([]);
  });

  test("returns matching results for single term", () => {
    const results = filterSearchIndex(sampleIndex, "hiking");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.path === "/hiking")).toBe(true);
  });

  test("multi-term AND matching requires all terms", () => {
    const results = filterSearchIndex(sampleIndex, "summer camp");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.path === "/events")).toBe(true);
  });

  test("multi-term AND excludes partial matches", () => {
    const results = filterSearchIndex(sampleIndex, "hiking email");
    expect(results).toEqual([]);
  });

  test("title match ranks higher than body-only match", () => {
    const index: SearchIndexEntry[] = [
      {
        path: "/body-only",
        title: "Other Page",
        text: "this page mentions hiking in the body text",
        componentId: "c1",
        weight: 1,
      },
      {
        path: "/title-match",
        title: "Hiking Guide",
        text: "a guide about outdoor activities",
        componentId: "c2",
        weight: 1,
      },
    ];
    const results = filterSearchIndex(index, "hiking");
    expect(results.length).toBe(2);
    expect(results[0].path).toBe("/title-match");
  });

  test("higher frequency ranks higher", () => {
    const index: SearchIndexEntry[] = [
      {
        path: "/once",
        title: "Page A",
        text: "camping is fun and we enjoy it",
        componentId: "c1",
        weight: 1,
      },
      {
        path: "/many",
        title: "Page B",
        text: "camping camping camping is our favorite camping activity",
        componentId: "c2",
        weight: 1,
      },
    ];
    const results = filterSearchIndex(index, "camping");
    expect(results.length).toBe(2);
    expect(results[0].path).toBe("/many");
  });

  test("returns at most 10 results", () => {
    const largeIndex: SearchIndexEntry[] = Array.from(
      { length: 20 },
      (_, i) => ({
        path: `/page-${i}`,
        title: `Test Page ${i}`,
        text: "common search term appears here",
        componentId: `c${i}`,
        weight: 1,
      }),
    );
    const results = filterSearchIndex(largeIndex, "common");
    expect(results.length).toBeLessThanOrEqual(10);
  });

  test("results include id, path, title, and snippet", () => {
    const results = filterSearchIndex(sampleIndex, "contact");
    expect(results.length).toBeGreaterThan(0);
    const result = results[0];
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("path");
    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("snippet");
    expect(result).toHaveProperty("componentId");
  });

  test("returns separate results for same-page entries", () => {
    const index: SearchIndexEntry[] = [
      { path: "/page", title: "My Page", text: "Haus", componentId: "c1", weight: 1 },
      { path: "/page", title: "My Page", text: "Das Haus am See.", componentId: "c2", weight: 1 },
      { path: "/page", title: "My Page", text: "Baumhaus", componentId: "c3", weight: 1 },
    ];
    const results = filterSearchIndex(index, "haus");
    expect(results.length).toBe(3);
    const ids = results.map((r) => r.id);
    expect(new Set(ids).size).toBe(3);
  });

  test("finds terms deep in long text", () => {
    const index: SearchIndexEntry[] = [
      {
        path: "/long",
        title: "Long Page",
        text: "x ".repeat(500) + "Baumhaus" + " y".repeat(500),
        componentId: "c1",
        weight: 1,
      },
    ];
    const results = filterSearchIndex(index, "baumhaus");
    expect(results.length).toBe(1);
    expect(results[0].path).toBe("/long");
  });

  test("heading ranks higher than plain text", () => {
    const index: SearchIndexEntry[] = [
      { path: "/page", title: "Page", text: "Zuhause", componentId: "c1", weight: 1 },
      { path: "/page", title: "Page", text: "Haus", componentId: "c2", weight: 4 },
      { path: "/page", title: "Page", text: "Haus2", componentId: "c3", weight: 3 },
      { path: "/page", title: "Page", text: "Haus 3", componentId: "c4", weight: 2 },
    ];
    const results = filterSearchIndex(index, "haus");
    expect(results.length).toBe(4);
    expect(results[0].componentId).toBe("c2");
    expect(results[1].componentId).toBe("c3");
  });

  test("snippet preserves original case", () => {
    const index: SearchIndexEntry[] = [
      {
        path: "/case",
        title: "Case Test",
        text: "Das Haus am See ist sehr schoen",
        componentId: "c1",
        weight: 1,
      },
    ];
    const results = filterSearchIndex(index, "haus");
    expect(results.length).toBe(1);
    expect(results[0].snippet).toContain("Haus");
  });
});

describe("buildSnippet", () => {
  test("centers snippet around first match", () => {
    const text = "a".repeat(100) + "target" + "b".repeat(100);
    const snippet = buildSnippet(text, "target");
    expect(snippet).toContain("target");
    expect(snippet).toContain("...");
  });

  test("returns start of text when no match found", () => {
    const text =
      "this is a long piece of text that does not contain the search term anywhere in the middle or end";
    const snippet = buildSnippet(text, "xyz");
    expect(snippet).toBe(text.slice(0, 80));
  });

  test("does not add ellipsis at start when match is near beginning", () => {
    const text = "hello world this is a test";
    const snippet = buildSnippet(text, "hello");
    expect(snippet).not.toMatch(/^\.\.\./);
  });

  test("does not add ellipsis at end for short text", () => {
    const text = "short text";
    const snippet = buildSnippet(text, "text");
    expect(snippet).not.toMatch(/\.\.\.$/);
  });
});

describe("countOccurrences", () => {
  test("counts multiple occurrences", () => {
    expect(countOccurrences("foo bar foo baz foo", "foo")).toBe(3);
  });

  test("is case insensitive", () => {
    expect(countOccurrences("Hello HELLO hello", "hello")).toBe(3);
  });

  test("returns 0 for no match", () => {
    expect(countOccurrences("hello world", "xyz")).toBe(0);
  });

  test("returns 0 for empty term", () => {
    expect(countOccurrences("hello world", "")).toBe(0);
  });
});
