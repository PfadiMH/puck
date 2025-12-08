import { headingConfig } from "@components/puck/Heading";
import { createPuckProps } from "@lib/testing/puckProps";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import TestWrapper from "../TestWrapper";

test("renders", async () => {
  const screen = await render(
    <TestWrapper>
      <headingConfig.render
        {...createPuckProps()}
        text="Hello World!"
        textAlign="left"
        level="h1"
      />
    </TestWrapper>
  );

  expect(screen.getByText("Hello World!")).toBeVisible();
});
