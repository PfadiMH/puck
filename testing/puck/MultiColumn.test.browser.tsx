import { multiColumnConfig } from "@components/puck/MultiColumn";
import { SlotComponent } from "@puckeditor/core";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

function createSlot(name: string): SlotComponent {
  return () => <div data-testid={`slot-${name}`} />;
}

function createProps(
  overrides: Partial<{
    layout: number[];
    gap: string;
    column0: SlotComponent;
    column1: SlotComponent;
    column2: SlotComponent;
    column3: SlotComponent;
  }> = {}
) {
  return {
    id: "test-id",
    puck: { renderDropZone: () => null, metadata: {}, isEditing: false, dragRef: null },
    layout: [1, 1] as number[],
    gap: "1rem",
    column0: createSlot("column0"),
    column1: createSlot("column1"),
    ...overrides,
  };
}

test("renders 2 slots for [1, 1] layout", async () => {
  const props = createProps({ layout: [1, 1] });

  const screen = await render(<multiColumnConfig.render {...props} />);

  await expect.element(screen.getByTestId("slot-column0")).toBeInTheDocument();
  await expect.element(screen.getByTestId("slot-column1")).toBeInTheDocument();
});

test("renders 3 slots for [1, 1, 1] layout", async () => {
  const props = createProps({
    layout: [1, 1, 1],
    column2: createSlot("column2"),
  });

  const screen = await render(<multiColumnConfig.render {...props} />);

  await expect.element(screen.getByTestId("slot-column0")).toBeInTheDocument();
  await expect.element(screen.getByTestId("slot-column1")).toBeInTheDocument();
  await expect.element(screen.getByTestId("slot-column2")).toBeInTheDocument();
});

test("renders 4 slots for [1, 1, 1, 1] layout", async () => {
  const props = createProps({
    layout: [1, 1, 1, 1],
    column2: createSlot("column2"),
    column3: createSlot("column3"),
  });

  const screen = await render(<multiColumnConfig.render {...props} />);

  await expect.element(screen.getByTestId("slot-column0")).toBeInTheDocument();
  await expect.element(screen.getByTestId("slot-column1")).toBeInTheDocument();
  await expect.element(screen.getByTestId("slot-column2")).toBeInTheDocument();
  await expect.element(screen.getByTestId("slot-column3")).toBeInTheDocument();
});

test("applies correct grid-template-columns for [1, 1]", async () => {
  const props = createProps({ layout: [1, 1] });

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.gridTemplateColumns).toBe("1fr 1fr");
});

test("applies correct grid-template-columns for [1, 2]", async () => {
  const props = createProps({ layout: [1, 2] });

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.gridTemplateColumns).toBe("1fr 2fr");
});

test("applies correct grid-template-columns for [1, 2, 1]", async () => {
  const props = createProps({
    layout: [1, 2, 1],
    column2: createSlot("column2"),
  });

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.gridTemplateColumns).toBe("1fr 2fr 1fr");
});

test("default props render correctly", async () => {
  const props = createProps({});

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.gridTemplateColumns).toBe("1fr 1fr");
  expect(container.style.gap).toBe("1rem");
  expect(container.children.length).toBe(2);
});

test("gap 0 applies 0", async () => {
  const props = createProps({ gap: "0" });

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.gap).toBe("0px");
});

test("gap 0.5rem applies 0.5rem", async () => {
  const props = createProps({ gap: "0.5rem" });

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.gap).toBe("0.5rem");
});

test("gap 2rem applies 2rem", async () => {
  const props = createProps({ gap: "2rem" });

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.gap).toBe("2rem");
});

test("fallback to [1, 1] for invalid layout", async () => {
  const props = createProps({
    layout: "invalid" as unknown as number[],
  });

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.gridTemplateColumns).toBe("1fr 1fr");
  expect(container.children.length).toBe(2);
});

test("columns have proper styling to handle content", async () => {
  const props = createProps({ layout: [1, 1] });

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

test("align-items start prevents vertical stretching", async () => {
  const props = createProps({ layout: [1, 1] });

  const screen = await render(<multiColumnConfig.render {...props} />);
  const container = screen.container.firstChild as HTMLElement;

  expect(container.style.alignItems).toBe("start");
});
