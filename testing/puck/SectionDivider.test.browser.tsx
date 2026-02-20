import { sectionDividerConfig } from "@components/puck/SectionDivider";
import { createPuckProps } from "@lib/testing/puckProps";
import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";

describe("SectionDivider", () => {
  describe("container structure", () => {
    test("renders container div with full class", async () => {
      const { container } = await render(
        <sectionDividerConfig.render {...createPuckProps()} />
      );
      const div = container.querySelector(".full");
      expect(div).not.toBeNull();
    });

    test("renders as div element", async () => {
      const { container } = await render(
        <sectionDividerConfig.render {...createPuckProps()} />
      );
      expect(container.firstElementChild?.tagName).toBe("DIV");
    });
  });

  describe("SectionBreak child", () => {
    test("renders SectionBreak component", async () => {
      const { container } = await render(
        <sectionDividerConfig.render {...createPuckProps()} />
      );
      const fullDiv = container.querySelector(".full");
      expect(fullDiv?.children.length).toBeGreaterThan(0);
    });
  });

  describe("multiple renders", () => {
    test("renders consistently on multiple mounts", async () => {
      const { container: container1 } = await render(
        <sectionDividerConfig.render {...createPuckProps()} />
      );
      const { container: container2 } = await render(
        <sectionDividerConfig.render {...createPuckProps()} />
      );

      const div1 = container1.querySelector(".full");
      const div2 = container2.querySelector(".full");

      expect(div1).not.toBeNull();
      expect(div2).not.toBeNull();
    });
  });
});
