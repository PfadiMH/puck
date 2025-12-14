import { textConfig } from "@components/puck/Text";
import { createPuckProps } from "@lib/testing/puckProps";
import { render } from "@lib/testing/render";
import { expect, test } from "vitest";

test("renders", async () => {
  const screen = await render(
    <textConfig.render {...createPuckProps()} text="Hello World!" />
  );

  expect(screen.getByText("Hello World!")).toBeVisible();
});
