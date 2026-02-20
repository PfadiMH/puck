import { headingConfig } from "@components/puck/Heading";
import { createPuckProps } from "@lib/testing/puckProps";
import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";

describe("Heading", () => {
  describe("heading levels", () => {
    test("renders h1 element", async () => {
      const screen = await render(
        <headingConfig.render {...createPuckProps()} text="Test" textAlign="left" level="h1" />
      );
      expect(screen.getByRole("heading", { level: 1 })).toBeVisible();
    });

    test("renders h2 element", async () => {
      const screen = await render(
        <headingConfig.render {...createPuckProps()} text="Test" textAlign="left" level="h2" />
      );
      expect(screen.getByRole("heading", { level: 2 })).toBeVisible();
    });

    test("renders h3 element", async () => {
      const screen = await render(
        <headingConfig.render {...createPuckProps()} text="Test" textAlign="left" level="h3" />
      );
      expect(screen.getByRole("heading", { level: 3 })).toBeVisible();
    });
  });

  describe("text content", () => {
    test("displays text content", async () => {
      const screen = await render(
        <headingConfig.render {...createPuckProps()} text="Hello World" textAlign="center" level="h1" />
      );
      expect(screen.getByText("Hello World")).toBeVisible();
    });

    test("handles empty text", async () => {
      const { container } = await render(
        <headingConfig.render {...createPuckProps()} text="" textAlign="left" level="h1" />
      );
      const h1 = container.querySelector("h1");
      expect(h1).not.toBeNull();
      expect(h1?.textContent).toBe("");
    });

    test("handles special characters", async () => {
      const screen = await render(
        <headingConfig.render {...createPuckProps()} text="Test & <Special> 'Characters'" textAlign="left" level="h1" />
      );
      expect(screen.getByText("Test & <Special> 'Characters'")).toBeVisible();
    });

    test("handles long text", async () => {
      const longText = "A".repeat(500);
      const screen = await render(
        <headingConfig.render {...createPuckProps()} text={longText} textAlign="left" level="h1" />
      );
      expect(screen.getByText(longText)).toBeVisible();
    });
  });

  describe("text alignment", () => {
    test("applies left alignment", async () => {
      const { container } = await render(
        <headingConfig.render {...createPuckProps()} text="Test" textAlign="left" level="h1" />
      );
      const heading = container.querySelector("h1");
      expect(heading?.style.textAlign).toBe("left");
    });

    test("applies center alignment", async () => {
      const { container } = await render(
        <headingConfig.render {...createPuckProps()} text="Test" textAlign="center" level="h1" />
      );
      const heading = container.querySelector("h1");
      expect(heading?.style.textAlign).toBe("center");
    });

    test("applies right alignment", async () => {
      const { container } = await render(
        <headingConfig.render {...createPuckProps()} text="Test" textAlign="right" level="h1" />
      );
      const heading = container.querySelector("h1");
      expect(heading?.style.textAlign).toBe("right");
    });
  });

  describe("css classes", () => {
    test("has text-wrap class", async () => {
      const { container } = await render(
        <headingConfig.render {...createPuckProps()} text="Test" textAlign="left" level="h1" />
      );
      const heading = container.querySelector("h1");
      expect(heading?.className).toContain("text-wrap");
    });
  });

  describe("prop combinations", () => {
    test("h1 with right alignment", async () => {
      const { container } = await render(
        <headingConfig.render {...createPuckProps()} text="Right H1" textAlign="right" level="h1" />
      );
      const heading = container.querySelector("h1");
      expect(heading).not.toBeNull();
      expect(heading?.style.textAlign).toBe("right");
    });

    test("h2 with center alignment", async () => {
      const { container } = await render(
        <headingConfig.render {...createPuckProps()} text="Center H2" textAlign="center" level="h2" />
      );
      const heading = container.querySelector("h2");
      expect(heading).not.toBeNull();
      expect(heading?.style.textAlign).toBe("center");
    });

    test("h3 with left alignment", async () => {
      const { container } = await render(
        <headingConfig.render {...createPuckProps()} text="Left H3" textAlign="left" level="h3" />
      );
      const heading = container.querySelector("h3");
      expect(heading).not.toBeNull();
      expect(heading?.style.textAlign).toBe("left");
    });
  });
});
