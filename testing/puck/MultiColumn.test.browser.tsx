import { LayoutPreset, multiColumnConfig, MultiColumnProps } from "@components/puck/MultiColumn";
import { WithId, WithPuckProps } from "@measured/puck";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

function createMultiColumnProps(
  props: Partial<MultiColumnProps> = {},
  zones: string[] = []
): WithId<WithPuckProps<MultiColumnProps>> {
  return {
    id: "test-multi-column-id",
    puck: {
      renderDropZone: ({ zone }: { zone: string }) => {
        zones.push(zone);
        return <div data-testid={`dropzone-${zone}`} />;
      },
      isEditing: false,
      dragRef: null,
    },
    layout: "50 / 50",
    gap: "medium",
    stackOnMobile: true,
    ...props,
  };
}

test("renders 2 drop zones for 50/50 layout", async () => {
  const zones: string[] = [];
  const props = createMultiColumnProps({ layout: "50 / 50" }, zones);

  await render(<multiColumnConfig.render {...props} />);

  expect(zones).toHaveLength(2);
  expect(zones).toContain("column-0");
  expect(zones).toContain("column-1");
});

test("renders 3 drop zones for 33/33/33 layout", async () => {
  const zones: string[] = [];
  const props = createMultiColumnProps({ layout: "33 / 33 / 33" }, zones);

  await render(<multiColumnConfig.render {...props} />);

  expect(zones).toHaveLength(3);
  expect(zones).toContain("column-0");
  expect(zones).toContain("column-1");
  expect(zones).toContain("column-2");
});

test("renders 4 drop zones for 25/25/25/25 layout", async () => {
  const zones: string[] = [];
  const props = createMultiColumnProps({ layout: "25 / 25 / 25 / 25" }, zones);

  await render(<multiColumnConfig.render {...props} />);

  expect(zones).toHaveLength(4);
});

test("applies correct grid-template-columns for 50/50", async () => {
  const props = createMultiColumnProps({ layout: "50 / 50" });

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.gridTemplateColumns).toBe("1fr 1fr");
});

test("applies correct grid-template-columns for 33/67", async () => {
  const props = createMultiColumnProps({ layout: "33 / 67" });

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.gridTemplateColumns).toBe("1fr 2fr");
});

test("applies correct grid-template-columns for 25/50/25", async () => {
  const props = createMultiColumnProps({ layout: "25 / 50 / 25" });

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.gridTemplateColumns).toBe("1fr 2fr 1fr");
});

test("default props render correctly", async () => {
  const zones: string[] = [];
  const props = createMultiColumnProps({}, zones);

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(zones).toHaveLength(2);
  expect(container.style.gridTemplateColumns).toBe("1fr 1fr");
  expect(container.style.gap).toBe("1rem");
});

test("gap none applies 0", async () => {
  const props = createMultiColumnProps({ gap: "none" });

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.gap).toBe("0px");
});

test("gap small applies 0.5rem", async () => {
  const props = createMultiColumnProps({ gap: "small" });

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.gap).toBe("0.5rem");
});

test("gap large applies 2rem", async () => {
  const props = createMultiColumnProps({ gap: "large" });

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.gap).toBe("2rem");
});

test("stackOnMobile true applies class", async () => {
  const props = createMultiColumnProps({ stackOnMobile: true });

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.className).toBe("multi-column-stack-mobile");
});

test("stackOnMobile false does not apply class", async () => {
  const props = createMultiColumnProps({ stackOnMobile: false });

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.className).toBe("");
});

test("fallback to 50/50 for invalid layout", async () => {
  const zones: string[] = [];
  const props = createMultiColumnProps({ layout: "invalid" as unknown as LayoutPreset }, zones);

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(zones).toHaveLength(2);
  expect(container.style.gridTemplateColumns).toBe("1fr 1fr");
});

test("columns have proper styling to handle content", async () => {
  const props = createMultiColumnProps({ layout: "50 / 50" });

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;
  const columns = container.children;

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i] as HTMLElement;
    expect(column.style.minWidth).toBe("0px");
    expect(column.style.overflowWrap).toBe("break-word");
    expect(column.style.height).toBe("fit-content");
  }
});

test("columns maintain ratio regardless of content", async () => {
  const props = createMultiColumnProps({ layout: "50 / 50" });

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.gridTemplateColumns).toBe("1fr 1fr");
  expect(container.children.length).toBe(2);
});

test("align-items start prevents vertical stretching", async () => {
  const props = createMultiColumnProps({ layout: "50 / 50" });

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.alignItems).toBe("start");
});
