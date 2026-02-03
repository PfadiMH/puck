import { verticalSpaceConfig } from "@components/puck/VerticalSpace";
import { createPuckProps } from "@lib/testing/puckProps";
import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";

describe("VerticalSpace", () => {
  describe("height rendering", () => {
    test("renders with 48px height", async () => {
      const { container } = await render(
        <verticalSpaceConfig.render {...createPuckProps()} size="48px" />
      );
      const div = container.firstElementChild as HTMLElement;
      expect(div.style.height).toBe("48px");
    });

    test("renders with 24px height", async () => {
      const { container } = await render(
        <verticalSpaceConfig.render {...createPuckProps()} size="24px" />
      );
      const div = container.firstElementChild as HTMLElement;
      expect(div.style.height).toBe("24px");
    });

    test("renders with minimum size 8px", async () => {
      const { container } = await render(
        <verticalSpaceConfig.render {...createPuckProps()} size="8px" />
      );
      const div = container.firstElementChild as HTMLElement;
      expect(div.style.height).toBe("8px");
    });

    test("renders with maximum size 160px", async () => {
      const { container } = await render(
        <verticalSpaceConfig.render {...createPuckProps()} size="160px" />
      );
      const div = container.firstElementChild as HTMLElement;
      expect(div.style.height).toBe("160px");
    });
  });

  describe("width rendering", () => {
    test("renders with 100% width", async () => {
      const { container } = await render(
        <verticalSpaceConfig.render {...createPuckProps()} size="24px" />
      );
      const div = container.firstElementChild as HTMLElement;
      expect(div.style.width).toBe("100%");
    });

    test("width is always 100% regardless of size", async () => {
      const { container } = await render(
        <verticalSpaceConfig.render {...createPuckProps()} size="96px" />
      );
      const div = container.firstElementChild as HTMLElement;
      expect(div.style.width).toBe("100%");
    });
  });

  describe("various size options", () => {
    const sizes = ["16px", "32px", "64px", "80px", "128px"];

    sizes.forEach((size) => {
      test(`renders correctly with ${size}`, async () => {
        const { container } = await render(
          <verticalSpaceConfig.render {...createPuckProps()} size={size} />
        );
        const div = container.firstElementChild as HTMLElement;
        expect(div.style.height).toBe(size);
        expect(div.style.width).toBe("100%");
      });
    });
  });

  describe("element structure", () => {
    test("renders as div element", async () => {
      const { container } = await render(
        <verticalSpaceConfig.render {...createPuckProps()} size="24px" />
      );
      expect(container.firstElementChild?.tagName).toBe("DIV");
    });

    test("renders empty div (no children)", async () => {
      const { container } = await render(
        <verticalSpaceConfig.render {...createPuckProps()} size="24px" />
      );
      const div = container.firstElementChild as HTMLElement;
      expect(div.children.length).toBe(0);
      expect(div.textContent).toBe("");
    });
  });
});
