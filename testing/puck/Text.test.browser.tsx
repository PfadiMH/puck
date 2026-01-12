import { textConfig } from "@components/puck/Text";
import { createPuckProps } from "@lib/testing/puckProps";

import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

test("renders", async () => {
  const screen = await render(<textConfig.render {...createPuckProps()} text="Hello World!" />);

  expect(screen.getByText("Hello World!")).toBeVisible();
});
