import { heroConfig } from "@components/puck/Hero";
import { createPuckProps } from "@lib/testing/puckProps";
import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";

describe("Hero", () => {
  describe("title rendering", () => {
    test("renders title when provided", async () => {
      const screen = await render(
        <heroConfig.render {...createPuckProps()} title="Welcome" />
      );
      expect(screen.getByText("Welcome")).toBeVisible();
    });

    test("renders h1 element for title", async () => {
      const screen = await render(
        <heroConfig.render {...createPuckProps()} title="Test Title" />
      );
      expect(screen.getByRole("heading", { level: 1 })).toBeVisible();
    });

    test("does not render h1 when title is empty", async () => {
      const { container } = await render(
        <heroConfig.render {...createPuckProps()} title="" />
      );
      const h1 = container.querySelector("h1");
      expect(h1).toBeNull();
    });

    test("handles special characters in title", async () => {
      const screen = await render(
        <heroConfig.render {...createPuckProps()} title="Welcome & <Hello>" />
      );
      expect(screen.getByText("Welcome & <Hello>")).toBeVisible();
    });

    test("handles long title", async () => {
      const longTitle = "Welcome ".repeat(50);
      const screen = await render(
        <heroConfig.render {...createPuckProps()} title={longTitle} />
      );
      expect(screen.getByText(longTitle)).toBeVisible();
    });
  });

  describe("title styling", () => {
    test("title has correct classes", async () => {
      const { container } = await render(
        <heroConfig.render {...createPuckProps()} title="Test" />
      );
      const h1 = container.querySelector("h1");
      expect(h1?.className).toContain("text-4xl");
      expect(h1?.className).toContain("font-bold");
      expect(h1?.className).toContain("text-center");
      expect(h1?.className).toContain("text-white");
    });
  });

  describe("container structure", () => {
    test("renders container div", async () => {
      const { container } = await render(
        <heroConfig.render {...createPuckProps()} title="Test" />
      );
      const div = container.querySelector(".full");
      expect(div).not.toBeNull();
    });

    test("container has correct height", async () => {
      const { container } = await render(
        <heroConfig.render {...createPuckProps()} title="Test" />
      );
      const div = container.querySelector(".h-96");
      expect(div).not.toBeNull();
    });

    test("container has flex centering", async () => {
      const { container } = await render(
        <heroConfig.render {...createPuckProps()} title="Test" />
      );
      const div = container.firstElementChild;
      expect(div?.className).toContain("flex");
      expect(div?.className).toContain("flex-col");
      expect(div?.className).toContain("justify-center");
      expect(div?.className).toContain("items-center");
    });
  });

  describe("background image", () => {
    test("renders without background image", async () => {
      const { container } = await render(
        <heroConfig.render {...createPuckProps()} title="Test" />
      );
      const img = container.querySelector("img");
      expect(img).toBeNull();
    });

    test("renders with background image", async () => {
      const { container } = await render(
        <heroConfig.render {...createPuckProps()} title="Test" backgroundImage="/test.jpg" />
      );
      const img = container.querySelector("img");
      expect(img).not.toBeNull();
    });

    test("background image has alt text", async () => {
      const { container } = await render(
        <heroConfig.render {...createPuckProps()} title="Test" backgroundImage="/test.jpg" />
      );
      const img = container.querySelector("img");
      expect(img?.getAttribute("alt")).toBe("Hero Image");
    });
  });

  describe("overlay", () => {
    test("renders overlay when title is present", async () => {
      const { container } = await render(
        <heroConfig.render {...createPuckProps()} title="Test" />
      );
      const overlay = container.querySelector(".bg-black.opacity-15");
      expect(overlay).not.toBeNull();
    });

    test("does not render overlay when title is empty", async () => {
      const { container } = await render(
        <heroConfig.render {...createPuckProps()} title="" />
      );
      const overlay = container.querySelector(".bg-black.opacity-15");
      expect(overlay).toBeNull();
    });
  });

  describe("edge cases", () => {
    test("renders with only background image, no title", async () => {
      const { container } = await render(
        <heroConfig.render {...createPuckProps()} title="" backgroundImage="/test.jpg" />
      );
      const img = container.querySelector("img");
      const h1 = container.querySelector("h1");
      expect(img).not.toBeNull();
      expect(h1).toBeNull();
    });

    test("renders with both title and background image", async () => {
      const { container } = await render(
        <heroConfig.render {...createPuckProps()} title="Hero Title" backgroundImage="/test.jpg" />
      );
      const img = container.querySelector("img");
      const h1 = container.querySelector("h1");
      expect(img).not.toBeNull();
      expect(h1).not.toBeNull();
    });
  });
});
