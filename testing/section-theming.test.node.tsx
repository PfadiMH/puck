import type { PageData } from "@lib/config/page.config";
import { applySectionTheming } from "@lib/section-theming";
import { describe, expect, test } from "vitest";

describe("applySectionTheming", () => {
  test("alternate sun/mud themes divided by SectionDivider", () => {
    const data: PageData = {
      content: [
        { type: "RichText", props: { id: "", content: "<h1>Heading</h1>" } },
        { type: "SectionDivider", props: { id: "" } },
        { type: "RichText", props: { id: "", content: "<p>Mir sind Voll Däbii!</p>" } },
        { type: "SectionDivider", props: { id: "" } },
        { type: "RichText", props: { id: "", content: "<p>Mir sind Voll Däbii!</p>" } },
      ],
      root: { props: { title: "Test Page" } },
    };

    const result = applySectionTheming(data);

    expect(result.data.content.map(item => item.props)).toEqual([
      expect.objectContaining({ theme: "mud" }),
      expect.objectContaining({ theme: "sun" }),
      expect.objectContaining({ theme: "sun" }),
      expect.objectContaining({ theme: "mud" }),
      expect.objectContaining({ theme: "mud" }),
    ]);
  });
});
