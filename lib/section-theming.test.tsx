import { describe, expect, test } from "vitest";
import { applySectionTheming } from "./section-theming";
import { PageData } from "./config/page.config";

describe("applySectionTheming", () => {
  test("alternate sun/mud themes divided by SectionDivider", () => {
      const data: PageData = {
        content: [
          { type: "Heading", props: { id: "",text: "Heading", textAlign: "center", level: "h1" } },
          { type: "SectionDivider", props: { id: "" } },
          { type: "Text", props: { id: "", text: "Mir sind Voll Däbii!" } },
          { type: "SectionDivider", props: { id: "" } },
          { type: "Text", props: { id: "", text: "Mir sind Voll Däbii!" } },
        ],
        root: {props: {title: "Test Page"}}
      };

      const result = applySectionTheming(data);

      expect(result.data.content.map(item => item.props)).toEqual([
        expect.objectContaining({theme: "mud"}),
        expect.objectContaining({theme: "sun"}),
        expect.objectContaining({theme: "sun"}),
        expect.objectContaining({theme: "mud"}), 
        expect.objectContaining({theme: "mud"})
      ])
    });
});
