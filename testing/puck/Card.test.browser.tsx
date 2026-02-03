import {
  CardProps,
  CardSpacing,
  CardVariant,
  cardConfig,
} from "@components/puck/Card";
import { WithId, WithPuckProps } from "@measured/puck";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

function createCardProps(
  props: Partial<CardProps> = {},
  zones: string[] = []
): WithId<WithPuckProps<CardProps>> {
  return {
    id: "test-card-id",
    puck: {
      renderDropZone: ({ zone }: { zone: string }) => {
        zones.push(zone);
        return <div data-testid={`dropzone-${zone}`} />;
      },
      isEditing: false,
      dragRef: null,
    },
    variant: "elevated",
    padding: "medium",
    shadow: "medium",
    ...props,
  };
}

test("renders single content DropZone", async () => {
  const zones: string[] = [];
  const props = createCardProps({}, zones);

  await render(<cardConfig.render {...props} />);

  expect(zones).toHaveLength(1);
  expect(zones).toContain("content");
});

test("elevated variant applies correct class", async () => {
  const props = createCardProps({ variant: "elevated" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.className).toBe("bg-elevated");
});

test("outlined variant applies correct classes", async () => {
  const props = createCardProps({ variant: "outlined" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.className).toContain("border");
  expect(container.className).toContain("border-contrast-ground");
  expect(container.className).toContain("bg-transparent");
});

test("filled variant applies correct classes", async () => {
  const props = createCardProps({ variant: "filled" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.className).toContain("bg-primary");
  expect(container.className).toContain("text-contrast-primary");
});

test("padding none applies 0", async () => {
  const props = createCardProps({ padding: "none" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.padding).toBe("0px");
});

test("padding small applies 0.75rem", async () => {
  const props = createCardProps({ padding: "small" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.padding).toBe("0.75rem");
});

test("padding medium applies 1.25rem", async () => {
  const props = createCardProps({ padding: "medium" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.padding).toBe("1.25rem");
});

test("padding large applies 2rem", async () => {
  const props = createCardProps({ padding: "large" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.padding).toBe("2rem");
});

test("shadow none applies no shadow", async () => {
  const props = createCardProps({ shadow: "none" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.boxShadow).toBe("none");
});

test("shadow small applies subtle shadow", async () => {
  const props = createCardProps({ shadow: "small" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.boxShadow).toContain("rgba(0, 0, 0, 0.08)");
});

test("shadow medium applies medium shadow", async () => {
  const props = createCardProps({ shadow: "medium" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.boxShadow).toContain("rgba(0, 0, 0, 0.1)");
});

test("shadow large applies pronounced shadow", async () => {
  const props = createCardProps({ shadow: "large" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.boxShadow).toContain("rgba(0, 0, 0, 0.12)");
});

test("border radius is fixed at 0.625rem", async () => {
  const props = createCardProps();

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.borderRadius).toBe("0.625rem");
});

test("default props render correctly", async () => {
  const zones: string[] = [];
  const props = createCardProps({}, zones);

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(zones).toHaveLength(1);
  expect(zones[0]).toBe("content");
  expect(container.className).toBe("bg-elevated");
  expect(container.style.padding).toBe("1.25rem");
  expect(container.style.borderRadius).toBe("0.625rem");
  expect(container.style.boxShadow).toContain("rgba(0, 0, 0, 0.1)");
});

test("fallback to defaults for invalid props", async () => {
  const props = createCardProps({
    variant: "invalid" as CardVariant,
    padding: "invalid" as CardSpacing,
    shadow: "invalid" as CardSpacing,
  });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.className).toBe("bg-elevated");
  expect(container.style.padding).toBe("1.25rem");
  expect(container.style.boxShadow).toBe("none");
});
