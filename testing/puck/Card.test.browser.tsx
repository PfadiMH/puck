import {
  CardProps,
  CardSpacing,
  CardVariant,
  cardConfig,
} from "@components/puck/Card";
import { SlotComponent } from "@puckeditor/core";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

type CardRenderProps = Omit<CardProps, "content"> & {
  id: string;
  content: SlotComponent;
};

const Card = cardConfig.render as (props: CardRenderProps) => React.ReactNode;

function createCardProps(props: Partial<CardRenderProps> = {}): CardRenderProps {
  return {
    id: "test-card-id",
    content: () => <div data-testid="slot-content">slot</div>,
    variant: "elevated",
    padding: "medium",
    shadow: "medium",
    ...props,
  };
}

test("renders content slot", async () => {
  const props = createCardProps();

  const screen = await render(<Card {...props} />);

  await expect.element(screen.getByTestId("slot-content")).toBeVisible();
});

test("elevated variant applies correct class", async () => {
  const props = createCardProps({ variant: "elevated" });

  const screen = await render(<Card {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.className).toContain("bg-elevated");
});

test("outlined variant applies correct classes", async () => {
  const props = createCardProps({ variant: "outlined" });

  const screen = await render(<Card {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.className).toContain("border");
  expect(container.className).toContain("border-contrast-ground");
  expect(container.className).toContain("bg-transparent");
});

test("filled variant applies correct classes", async () => {
  const props = createCardProps({ variant: "filled" });

  const screen = await render(<Card {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.className).toContain("bg-primary");
  expect(container.className).toContain("text-contrast-primary");
});

test("padding none applies p-0", async () => {
  const props = createCardProps({ padding: "none" });

  const screen = await render(<Card {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.className).toContain("p-0");
});

test("padding small applies p-3", async () => {
  const props = createCardProps({ padding: "small" });

  const screen = await render(<Card {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.className).toContain("p-3");
});

test("padding medium applies p-5", async () => {
  const props = createCardProps({ padding: "medium" });

  const screen = await render(<Card {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.className).toContain("p-5");
});

test("padding large applies p-8", async () => {
  const props = createCardProps({ padding: "large" });

  const screen = await render(<Card {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.className).toContain("p-8");
});

test("shadow none applies no shadow class", async () => {
  const props = createCardProps({ shadow: "none" });

  const screen = await render(<Card {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.className).not.toContain("shadow-");
});

test("shadow small applies shadow-sm", async () => {
  const props = createCardProps({ shadow: "small" });

  const screen = await render(<Card {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.className).toContain("shadow-sm");
});

test("shadow medium applies shadow-md", async () => {
  const props = createCardProps({ shadow: "medium" });

  const screen = await render(<Card {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.className).toContain("shadow-md");
});

test("shadow large applies shadow-lg", async () => {
  const props = createCardProps({ shadow: "large" });

  const screen = await render(<Card {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.className).toContain("shadow-lg");
});

test("border radius uses rounded-xl", async () => {
  const props = createCardProps();

  const screen = await render(<Card {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.className).toContain("rounded-[0.625rem]");
});

test("default props render correctly", async () => {
  const props = createCardProps();

  const screen = await render(<Card {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  await expect.element(screen.getByTestId("slot-content")).toBeVisible();
  expect(container.className).toContain("bg-elevated");
  expect(container.className).toContain("p-5");
  expect(container.className).toContain("rounded-[0.625rem]");
  expect(container.className).toContain("shadow-md");
});

test("fallback to defaults for invalid props", async () => {
  const props = createCardProps({
    variant: "invalid" as CardVariant,
    padding: "invalid" as CardSpacing,
    shadow: "invalid" as CardSpacing,
  });

  const screen = await render(<Card {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.className).toContain("bg-elevated");
  expect(container.className).toContain("p-5");
  expect(container.className).not.toContain("shadow-");
});
