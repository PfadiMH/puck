import { describe, expect, test } from "vitest";
import { applySectionTheming } from "./section-theming";
import { PageData } from "./config/page.config";

describe("applySectionTheming", () => {
  test("alternate sun/mud themes divided by SectionDivider", () => {
      const data: PageData = {
        content: [
          { type: "Heading", props: {} as any },
          { type: "SectionDivider", props: {} as any },
          { type: "Text", props: {} as any },
          { type: "SectionDivider", props: {} as any },
          { type: "Text", props: {} as any },
        ],
        root: {props: {title: "Test Page"}}
      };

      const result = applySectionTheming(data);

      expect(result.data.content.map(item => item.props)).toEqual([{theme: "mud"}, {theme: "sun"}, {theme: "sun"}, {theme: "mud"}, {theme: "mud"}])
    });
});
