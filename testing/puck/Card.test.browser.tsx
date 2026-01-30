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
    borderRadius: "small",
    shadow: "none",
    showHeader: true,
    showFooter: true,
    ...props,
  };
}

test("renders all three DropZones when both toggles enabled", async () => {
  const zones: string[] = [];
  const props = createCardProps({}, zones);

  await render(<cardConfig.render {...props} />);

  expect(zones).toHaveLength(3);
  expect(zones).toContain("header");
  expect(zones).toContain("body");
  expect(zones).toContain("footer");
});

test("renders only body and footer when showHeader is false", async () => {
  const zones: string[] = [];
  const props = createCardProps({ showHeader: false }, zones);

  await render(<cardConfig.render {...props} />);

  expect(zones).toHaveLength(2);
  expect(zones).not.toContain("header");
  expect(zones).toContain("body");
  expect(zones).toContain("footer");
});

test("renders only header and body when showFooter is false", async () => {
  const zones: string[] = [];
  const props = createCardProps({ showFooter: false }, zones);

  await render(<cardConfig.render {...props} />);

  expect(zones).toHaveLength(2);
  expect(zones).toContain("header");
  expect(zones).toContain("body");
  expect(zones).not.toContain("footer");
});

test("renders only body when both toggles are false", async () => {
  const zones: string[] = [];
  const props = createCardProps({ showHeader: false, showFooter: false }, zones);

  await render(<cardConfig.render {...props} />);

  expect(zones).toHaveLength(1);
  expect(zones).toContain("body");
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

test("padding small applies 0.5rem", async () => {
  const props = createCardProps({ padding: "small" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.padding).toBe("0.5rem");
});

test("padding medium applies 1rem", async () => {
  const props = createCardProps({ padding: "medium" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.padding).toBe("1rem");
});

test("padding large applies 2rem", async () => {
  const props = createCardProps({ padding: "large" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.padding).toBe("2rem");
});

test("borderRadius none applies 0", async () => {
  const props = createCardProps({ borderRadius: "none" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.borderRadius).toBe("0px");
});

test("borderRadius small applies 0.25rem", async () => {
  const props = createCardProps({ borderRadius: "small" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.borderRadius).toBe("0.25rem");
});

test("borderRadius medium applies 0.5rem", async () => {
  const props = createCardProps({ borderRadius: "medium" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.borderRadius).toBe("0.5rem");
});

test("borderRadius large applies 1rem", async () => {
  const props = createCardProps({ borderRadius: "large" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.borderRadius).toBe("1rem");
});

test("shadow none applies no shadow", async () => {
  const props = createCardProps({ shadow: "none" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.boxShadow).toBe("none");
  expect(container.style.margin).toBe("0px");
});

test("shadow small applies subtle shadow", async () => {
  const props = createCardProps({ shadow: "small" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.boxShadow).toContain("rgba(0, 0, 0, 0.4)");
  expect(container.style.margin).toBe("0.5rem");
});

test("shadow medium applies medium shadow", async () => {
  const props = createCardProps({ shadow: "medium" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.boxShadow).toContain("rgba(0, 0, 0, 0.5)");
  expect(container.style.margin).toBe("1rem");
});

test("shadow large applies prominent shadow", async () => {
  const props = createCardProps({ shadow: "large" });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.boxShadow).toContain("rgba(0, 0, 0, 0.6)");
  expect(container.style.margin).toBe("1.5rem");
});

test("default props render correctly", async () => {
  const zones: string[] = [];
  const props = createCardProps({}, zones);

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(zones).toHaveLength(3);
  expect(container.className).toBe("bg-elevated");
  expect(container.style.padding).toBe("1rem");
  expect(container.style.borderRadius).toBe("0.25rem");
  expect(container.style.boxShadow).toBe("none");
});

test("card uses flexbox column layout", async () => {
  const props = createCardProps();

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.display).toBe("flex");
  expect(container.style.flexDirection).toBe("column");
});

test("zones render in correct order", async () => {
  const zones: string[] = [];
  const props = createCardProps({}, zones);

  await render(<cardConfig.render {...props} />);

  expect(zones[0]).toBe("header");
  expect(zones[1]).toBe("body");
  expect(zones[2]).toBe("footer");
});

test("fallback to defaults for invalid props", async () => {
  const props = createCardProps({
    variant: "invalid" as CardVariant,
    padding: "invalid" as CardSpacing,
    borderRadius: "invalid" as CardSpacing,
    shadow: "invalid" as CardSpacing,
  });

  const screen = await render(<cardConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.className).toBe("bg-elevated");
  expect(container.style.padding).toBe("1rem");
  expect(container.style.borderRadius).toBe("0.25rem");
  expect(container.style.boxShadow).toBe("none");
});
