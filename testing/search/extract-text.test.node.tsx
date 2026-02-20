import type { PageData } from "@lib/config/page.config";
import {
  extractSearchableSegments,
  extractSearchableText,
} from "@lib/search/extract-text";
import { describe, expect, test } from "vitest";

describe("extractSearchableText", () => {
  test("extracts text from Text component", () => {
    const data: PageData = {
      content: [
        { type: "Text", props: { id: "1", text: "Hello World" } },
      ],
      root: { props: { title: "Test" } },
    };

    const result = extractSearchableText(data);

    expect(result).toBe("Hello World");
  });

  test("extracts title from Hero component", () => {
    const data: PageData = {
      content: [
        { type: "Hero", props: { id: "1", title: "Hero Title" } },
      ],
      root: { props: { title: "Test" } },
    };

    const result = extractSearchableText(data);

    expect(result).toBe("Hero Title");
  });

  test("extracts text from multiple components", () => {
    const data: PageData = {
      content: [
        { type: "RichText", props: { id: "1", content: "<h1>Title</h1>" } },
        { type: "Text", props: { id: "2", text: "Body text" } },
        { type: "Hero", props: { id: "3", title: "Welcome" } },
      ],
      root: { props: { title: "Test" } },
    };

    const result = extractSearchableText(data);

    expect(result).toContain("Title");
    expect(result).toContain("Body text");
    expect(result).toContain("Welcome");
  });

  test("skips non-text components", () => {
    const data: PageData = {
      content: [
        { type: "VerticalSpace", props: { id: "1", size: "24px" } },
        { type: "SectionDivider", props: { id: "2" } },
        { type: "Text", props: { id: "3", text: "Visible" } },
      ],
      root: { props: { title: "Test" } },
    };

    const result = extractSearchableText(data);

    expect(result).toBe("Visible");
  });

  test("extracts text from Flex zones", () => {
    const data: PageData = {
      content: [
        { type: "Flex", props: { id: "1", items: [{}, {}], minItemWidth: 356 } },
      ],
      root: { props: { title: "Test" } },
      zones: {
        "1:item-0": [
          { type: "Text", props: { id: "2", text: "Zone A" } },
        ],
        "1:item-1": [
          { type: "RichText", props: { id: "3", content: "<h2>Zone B</h2>" } },
        ],
      },
    };

    const result = extractSearchableText(data);

    expect(result).toContain("Zone A");
    expect(result).toContain("Zone B");
  });

  test("extracts text from RichText component by stripping HTML", () => {
    const data = {
      content: [
        { type: "RichText", props: { id: "1", content: "<p>Hello <strong>bold</strong> world</p>" } },
      ],
      root: { props: { title: "Test" } },
    } as unknown as PageData;

    const result = extractSearchableText(data);

    expect(result).toBe("Hello bold world");
  });

  test("returns empty string for empty page", () => {
    const data: PageData = {
      content: [],
      root: { props: { title: "Empty" } },
    };

    const result = extractSearchableText(data);

    expect(result).toBe("");
  });
});

describe("extractSearchableSegments", () => {
  test("returns segments per text component", () => {
    const data: PageData = {
      content: [
        { type: "Text", props: { id: "2", text: "Das Haus am See." } },
        { type: "VerticalSpace", props: { id: "3", size: "24px" } },
      ],
      root: { props: { title: "Test" } },
    };

    const segments = extractSearchableSegments(data);

    expect(segments).toEqual([
      { text: "Das Haus am See.", componentId: "2", weight: 1 },
    ]);
  });

  test("RichText headings get higher weight", () => {
    const data: PageData = {
      content: [
        { type: "RichText", props: { id: "1", content: "<h1>Main Title</h1><p>Body text</p>" } },
      ],
      root: { props: { title: "Test" } },
    };

    const segments = extractSearchableSegments(data);

    const headingSegment = segments.find((s) => s.text === "Main Title");
    const bodySegment = segments.find((s) => s.text.includes("Body text"));

    expect(headingSegment).toBeDefined();
    expect(headingSegment?.weight).toBe(3);
    expect(bodySegment).toBeDefined();
    expect(bodySegment?.weight).toBe(1);
  });

  test("RichText h2 and h3 get intermediate weights", () => {
    const data: PageData = {
      content: [
        { type: "RichText", props: { id: "1", content: "<h2>Subtitle</h2><h3>Section</h3>" } },
      ],
      root: { props: { title: "Test" } },
    };

    const segments = extractSearchableSegments(data);

    const h2 = segments.find((s) => s.text === "Subtitle");
    const h3 = segments.find((s) => s.text === "Section");

    expect(h2?.weight).toBe(2.5);
    expect(h3?.weight).toBe(2);
  });

  test("Heading component uses level for weight", () => {
    const data: PageData = {
      content: [
        { type: "Heading", props: { id: "1", text: "H1 Title", level: "h1" } },
        { type: "Heading", props: { id: "2", text: "H2 Title", level: "h2" } },
        { type: "Heading", props: { id: "3", text: "H3 Title", level: "h3" } },
      ],
      root: { props: { title: "Test" } },
    };

    const segments = extractSearchableSegments(data);

    expect(segments).toEqual([
      { text: "H1 Title", componentId: "1", weight: 3 },
      { text: "H2 Title", componentId: "2", weight: 2.5 },
      { text: "H3 Title", componentId: "3", weight: 2 },
    ]);
  });

  test("Hero component gets weight 3", () => {
    const data: PageData = {
      content: [
        { type: "Hero", props: { id: "1", title: "Welcome" } },
      ],
      root: { props: { title: "Test" } },
    };

    const segments = extractSearchableSegments(data);

    expect(segments).toEqual([
      { text: "Welcome", componentId: "1", weight: 3 },
    ]);
  });

  test("includes zone components as separate segments", () => {
    const data: PageData = {
      content: [
        { type: "Text", props: { id: "1", text: "Main" } },
        { type: "Flex", props: { id: "2", items: [{}], minItemWidth: 356 } },
      ],
      root: { props: { title: "Test" } },
      zones: {
        "2:item-0": [
          { type: "Text", props: { id: "3", text: "Zone text" } },
        ],
      },
    };

    const segments = extractSearchableSegments(data);

    expect(segments).toEqual([
      { text: "Main", componentId: "1", weight: 1 },
      { text: "Zone text", componentId: "3", weight: 1 },
    ]);
  });

  test("returns empty array for empty page", () => {
    const data: PageData = {
      content: [],
      root: { props: { title: "Empty" } },
    };

    const segments = extractSearchableSegments(data);

    expect(segments).toEqual([]);
  });
});
