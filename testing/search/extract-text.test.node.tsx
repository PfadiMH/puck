import type { PageData } from "@lib/config/page.config";
import {
  extractSearchableSegments,
  extractSearchableText,
} from "@lib/search/extract-text";
import { describe, expect, test } from "vitest";

describe("extractSearchableText", () => {
  test("extracts text from RichText component", () => {
    const data = {
      content: [
        { type: "RichText", props: { id: "1", content: "<p>Hello World</p>" } },
      ],
      root: { props: { title: "Test" } },
    } as unknown as PageData;

    const result = extractSearchableText(data);

    expect(result).toBe("Hello World");
  });

  test("extracts title from Hero component", () => {
    const data = {
      content: [
        { type: "Hero", props: { id: "1", title: "Hero Title" } },
      ],
      root: { props: { title: "Test" } },
    } as unknown as PageData;

    const result = extractSearchableText(data);

    expect(result).toBe("Hero Title");
  });

  test("extracts text from multiple components", () => {
    const data = {
      content: [
        { type: "RichText", props: { id: "1", content: "<h1>Title</h1>" } },
        { type: "RichText", props: { id: "2", content: "<p>Body text</p>" } },
        { type: "Hero", props: { id: "3", title: "Welcome" } },
      ],
      root: { props: { title: "Test" } },
    } as unknown as PageData;

    const result = extractSearchableText(data);

    expect(result).toContain("Title");
    expect(result).toContain("Body text");
    expect(result).toContain("Welcome");
  });

  test("skips non-text components", () => {
    const data = {
      content: [
        { type: "VerticalSpace", props: { id: "1", size: "24px" } },
        { type: "SectionDivider", props: { id: "2" } },
        { type: "RichText", props: { id: "3", content: "<p>Visible</p>" } },
      ],
      root: { props: { title: "Test" } },
    } as unknown as PageData;

    const result = extractSearchableText(data);

    expect(result).toBe("Visible");
  });

  test("extracts text from MultiColumn zones", () => {
    const data = {
      content: [
        { type: "MultiColumn", props: { id: "1", columns: 2, gap: "medium" } },
      ],
      root: { props: { title: "Test" } },
      zones: {
        "1:column-0": [
          { type: "RichText", props: { id: "2", content: "<p>Zone A</p>" } },
        ],
        "1:column-1": [
          { type: "RichText", props: { id: "3", content: "<h2>Zone B</h2>" } },
        ],
      },
    } as unknown as PageData;

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

  test("extracts Activity fields including date and locations", () => {
    const data = {
      content: [
        {
          type: "Activity",
          props: {
            id: "1",
            mode: "manual",
            audience: "kinder",
            date: "2024-03-16",
            startTime: "14:00",
            endTime: "17:00",
            location: { name: "Pfadiheim Meilen", mapsLink: "" },
            endLocation: { name: "Bahnhof Herrliberg", mapsLink: "" },
            mitnehmen: [{ name: "Zvieri" }, { name: "Regenjacke" }],
            bemerkung: "Bei Regen fällt aus",
          },
        },
      ],
      root: { props: { title: "Test" } },
    } as unknown as PageData;

    const result = extractSearchableText(data);

    expect(result).toContain("Samstag");
    expect(result).toContain("16");
    expect(result).toContain("März");
    expect(result).toContain("Pfadiheim Meilen");
    expect(result).toContain("Bahnhof Herrliberg");
    expect(result).toContain("Zvieri");
    expect(result).toContain("Regenjacke");
    expect(result).toContain("Bei Regen fällt aus");
  });

  test("extracts ButtonGroup button labels", () => {
    const data = {
      content: [
        {
          type: "ButtonGroup",
          props: {
            id: "1",
            alignment: "left",
            size: "medium",
            spacing: "medium",
            iconPosition: "left",
            buttons: [
              { content: "Anmelden", color: "primary" },
              { content: "Mehr erfahren", color: "secondary" },
            ],
          },
        },
      ],
      root: { props: { title: "Test" } },
    } as unknown as PageData;

    const result = extractSearchableText(data);

    expect(result).toContain("Anmelden");
    expect(result).toContain("Mehr erfahren");
  });

  test("extracts Gallery image alt texts", () => {
    const data = {
      content: [
        {
          type: "Gallery",
          props: {
            id: "1",
            columns: 3,
            gap: "1rem",
            images: [
              { src: "/img1.jpg", alt: "Sommerlager 2023" },
              { src: "/img2.jpg", alt: "Pfingstlager" },
            ],
          },
        },
      ],
      root: { props: { title: "Test" } },
    } as unknown as PageData;

    const result = extractSearchableText(data);

    expect(result).toContain("Sommerlager 2023");
    expect(result).toContain("Pfingstlager");
  });

  test("extracts Form fields", () => {
    const data = {
      content: [
        {
          type: "Form",
          props: {
            id: "1",
            formTitle: "Kontaktformular",
            recipientEmail: "test@example.com",
            submitButtonText: "Absenden",
            successMessage: "Danke für deine Nachricht!",
            fields: [
              { label: "Vorname", type: "shortText", placeholder: "Max" },
              { label: "Nachname", type: "shortText", placeholder: "Muster" },
            ],
          },
        },
      ],
      root: { props: { title: "Test" } },
    } as unknown as PageData;

    const result = extractSearchableText(data);

    expect(result).toContain("Kontaktformular");
    expect(result).toContain("Absenden");
    expect(result).toContain("Danke für deine Nachricht!");
    expect(result).toContain("Vorname");
    expect(result).toContain("Nachname");
    expect(result).toContain("Max");
    expect(result).toContain("Muster");
  });

  test("extracts FooterLinkGroup heading and links", () => {
    const data = {
      content: [
        {
          type: "FooterLinkGroup",
          props: {
            id: "1",
            heading: "Kontakt",
            links: [
              { label: "E-Mail", url: "mailto:test@example.com" },
              { label: "Telefon", url: "tel:+41123456789" },
            ],
          },
        },
      ],
      root: { props: { title: "Test" } },
    } as unknown as PageData;

    const result = extractSearchableText(data);

    expect(result).toContain("Kontakt");
    expect(result).toContain("E-Mail");
    expect(result).toContain("Telefon");
  });
});

describe("extractSearchableSegments", () => {
  test("returns segments per component", () => {
    const data = {
      content: [
        { type: "RichText", props: { id: "2", content: "<p>Das Haus am See.</p>" } },
        { type: "VerticalSpace", props: { id: "3", size: "24px" } },
      ],
      root: { props: { title: "Test" } },
    } as unknown as PageData;

    const segments = extractSearchableSegments(data);

    expect(segments.length).toBeGreaterThanOrEqual(1);
    expect(segments.some((s) => s.text.includes("Das Haus am See"))).toBe(true);
  });

  test("RichText headings get higher weight", () => {
    const data = {
      content: [
        { type: "RichText", props: { id: "1", content: "<h1>Main Title</h1><p>Body text</p>" } },
      ],
      root: { props: { title: "Test" } },
    } as unknown as PageData;

    const segments = extractSearchableSegments(data);

    const headingSegment = segments.find((s) => s.text === "Main Title");
    const bodySegment = segments.find((s) => s.text.includes("Body text"));

    expect(headingSegment).toBeDefined();
    expect(headingSegment?.weight).toBe(3);
    expect(bodySegment).toBeDefined();
    expect(bodySegment?.weight).toBe(1);
  });

  test("RichText h2 and h3 get intermediate weights", () => {
    const data = {
      content: [
        { type: "RichText", props: { id: "1", content: "<h2>Subtitle</h2><h3>Section</h3>" } },
      ],
      root: { props: { title: "Test" } },
    } as unknown as PageData;

    const segments = extractSearchableSegments(data);

    const h2 = segments.find((s) => s.text === "Subtitle");
    const h3 = segments.find((s) => s.text === "Section");

    expect(h2?.weight).toBe(2.5);
    expect(h3?.weight).toBe(2);
  });

  test("Hero component gets weight 3", () => {
    const data = {
      content: [
        { type: "Hero", props: { id: "1", title: "Welcome" } },
      ],
      root: { props: { title: "Test" } },
    } as unknown as PageData;

    const segments = extractSearchableSegments(data);

    expect(segments).toEqual([
      { text: "Welcome", componentId: "1", weight: 3 },
    ]);
  });

  test("includes zone components as separate segments", () => {
    const data = {
      content: [
        { type: "RichText", props: { id: "1", content: "<p>Main</p>" } },
        { type: "MultiColumn", props: { id: "2", columns: 1, gap: "medium" } },
      ],
      root: { props: { title: "Test" } },
      zones: {
        "2:column-0": [
          { type: "RichText", props: { id: "3", content: "<p>Zone text</p>" } },
        ],
      },
    } as unknown as PageData;

    const segments = extractSearchableSegments(data);

    expect(segments.some((s) => s.text === "Main")).toBe(true);
    expect(segments.some((s) => s.text === "Zone text")).toBe(true);
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
