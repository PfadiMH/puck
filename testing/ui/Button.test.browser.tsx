import Button from "@components/ui/Button";
import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

describe("Button", () => {
  describe("rendering", () => {
    test("renders with children", async () => {
      const screen = await render(<Button>Click me</Button>);
      expect(screen.getByText("Click me")).toBeVisible();
    });

    test("renders as button element", async () => {
      const { container } = await render(<Button>Test</Button>);
      const button = container.querySelector("button");
      expect(button).not.toBeNull();
    });

    test("renders empty children", async () => {
      const { container } = await render(<Button>{""}</Button>);
      const button = container.querySelector("button");
      expect(button).not.toBeNull();
    });

    test("renders with multiple children", async () => {
      const screen = await render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );
      expect(screen.getByText("Icon")).toBeVisible();
      expect(screen.getByText("Text")).toBeVisible();
    });
  });

  describe("color variants", () => {
    test("applies primary color classes", async () => {
      const { container } = await render(<Button color="primary">Test</Button>);
      const button = container.querySelector("button");
      expect(button?.className).toContain("bg-primary");
      expect(button?.className).toContain("text-contrast-primary");
    });

    test("applies secondary color classes by default", async () => {
      const { container } = await render(<Button>Test</Button>);
      const button = container.querySelector("button");
      expect(button?.className).toContain("bg-secondary");
      expect(button?.className).toContain("text-contrast-secondary");
    });

    test("applies secondary color explicitly", async () => {
      const { container } = await render(<Button color="secondary">Test</Button>);
      const button = container.querySelector("button");
      expect(button?.className).toContain("bg-secondary");
    });
  });

  describe("size variants", () => {
    test("applies small size classes", async () => {
      const { container } = await render(<Button size="small">Test</Button>);
      const button = container.querySelector("button");
      expect(button?.className).toContain("text-sm");
      expect(button?.className).toContain("px-5");
      expect(button?.className).toContain("py-1");
      expect(button?.className).toContain("font-medium");
    });

    test("applies medium size classes by default", async () => {
      const { container } = await render(<Button>Test</Button>);
      const button = container.querySelector("button");
      expect(button?.className).toContain("text-base");
      expect(button?.className).toContain("px-5");
      expect(button?.className).toContain("py-2");
      expect(button?.className).toContain("font-semibold");
    });

    test("applies large size classes", async () => {
      const { container } = await render(<Button size="large">Test</Button>);
      const button = container.querySelector("button");
      expect(button?.className).toContain("text-lg");
      expect(button?.className).toContain("px-7");
      expect(button?.className).toContain("py-3");
      expect(button?.className).toContain("font-bold");
    });
  });

  describe("prop combinations", () => {
    test("small primary button", async () => {
      const { container } = await render(<Button size="small" color="primary">Test</Button>);
      const button = container.querySelector("button");
      expect(button?.className).toContain("text-sm");
      expect(button?.className).toContain("bg-primary");
    });

    test("large primary button", async () => {
      const { container } = await render(<Button size="large" color="primary">Test</Button>);
      const button = container.querySelector("button");
      expect(button?.className).toContain("text-lg");
      expect(button?.className).toContain("bg-primary");
    });

    test("small secondary button", async () => {
      const { container } = await render(<Button size="small" color="secondary">Test</Button>);
      const button = container.querySelector("button");
      expect(button?.className).toContain("text-sm");
      expect(button?.className).toContain("bg-secondary");
    });

    test("large secondary button", async () => {
      const { container } = await render(<Button size="large" color="secondary">Test</Button>);
      const button = container.querySelector("button");
      expect(button?.className).toContain("text-lg");
      expect(button?.className).toContain("bg-secondary");
    });
  });

  describe("HTML attributes", () => {
    test("passes through type attribute", async () => {
      const { container } = await render(<Button type="submit">Test</Button>);
      const button = container.querySelector("button");
      expect(button?.getAttribute("type")).toBe("submit");
    });

    test("passes through disabled attribute", async () => {
      const { container } = await render(<Button disabled>Test</Button>);
      const button = container.querySelector("button");
      expect(button?.hasAttribute("disabled")).toBe(true);
    });

    test("passes through id attribute", async () => {
      const { container } = await render(<Button id="my-button">Test</Button>);
      const button = container.querySelector("button");
      expect(button?.getAttribute("id")).toBe("my-button");
    });

    test("passes through aria-label", async () => {
      const { container } = await render(<Button aria-label="Close dialog">X</Button>);
      const button = container.querySelector("button");
      expect(button?.getAttribute("aria-label")).toBe("Close dialog");
    });

    test("passes through data attributes", async () => {
      const { container } = await render(<Button data-testid="submit-btn">Test</Button>);
      const button = container.querySelector("button");
      expect(button?.getAttribute("data-testid")).toBe("submit-btn");
    });
  });

  describe("className merging", () => {
    test("merges custom className with default classes", async () => {
      const { container } = await render(<Button className="custom-class">Test</Button>);
      const button = container.querySelector("button");
      expect(button?.className).toContain("custom-class");
      expect(button?.className).toContain("cursor-pointer");
    });

    test("custom className does not break base styles", async () => {
      const { container } = await render(<Button className="my-extra-class" color="primary">Test</Button>);
      const button = container.querySelector("button");
      expect(button?.className).toContain("bg-primary");
      expect(button?.className).toContain("my-extra-class");
    });
  });

  describe("user interactions", () => {
    test("calls onClick handler when clicked", async () => {
      const handleClick = vi.fn();
      const screen = await render(<Button onClick={handleClick}>Click me</Button>);

      await screen.getByText("Click me").click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test("does not call onClick when disabled", async () => {
      const handleClick = vi.fn();
      const { container } = await render(<Button onClick={handleClick} disabled>Click me</Button>);

      const button = container.querySelector("button") as HTMLButtonElement;
      button.click();
      expect(handleClick).not.toHaveBeenCalled();
    });

    test("calls onClick with event object", async () => {
      const handleClick = vi.fn();
      const screen = await render(<Button onClick={handleClick}>Click me</Button>);

      await screen.getByText("Click me").click();
      expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({
        type: "click",
      }));
    });
  });

  describe("base styles", () => {
    test("has cursor-pointer class", async () => {
      const { container } = await render(<Button>Test</Button>);
      const button = container.querySelector("button");
      expect(button?.className).toContain("cursor-pointer");
    });
  });
});
