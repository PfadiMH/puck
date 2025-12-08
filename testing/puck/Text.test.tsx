import { headingConfig } from "@components/puck/Heading";
import { createPuckProps } from "@lib/testing/puckProps";
import { testRender } from "@lib/testing/render";
import { expect, test } from "vitest";

test("renders", async () => {
  const screen = await testRender(
    <headingConfig.render
      {...createPuckProps()}
      text="Hello World!"
      textAlign="left"
      level="h1"
    />
  );

  expect(screen.getByText("Hello World!")).toBeVisible();
});
