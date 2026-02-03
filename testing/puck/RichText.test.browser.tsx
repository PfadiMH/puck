import { richTextConfig } from "@components/puck/RichText";
import { createPuckProps } from "@lib/testing/puckProps";

import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

test("renders html content", async () => {
  const screen = await render(
    <richTextConfig.render
      {...createPuckProps()}
      content="<p>Hello <strong>World</strong>!</p>"
    />
  );

  expect(screen.getByText("Hello")).toBeVisible();
  expect(screen.getByText("World")).toBeVisible();
});

test("renders headings", async () => {
  const screen = await render(
    <richTextConfig.render
      {...createPuckProps()}
      content="<h2>Test Heading</h2><p>Some text</p>"
    />
  );

  expect(screen.getByText("Test Heading")).toBeVisible();
  expect(screen.getByText("Some text")).toBeVisible();
});

test("renders lists", async () => {
  const screen = await render(
    <richTextConfig.render
      {...createPuckProps()}
      content="<ul><li>Item 1</li><li>Item 2</li></ul>"
    />
  );

  expect(screen.getByText("Item 1")).toBeVisible();
  expect(screen.getByText("Item 2")).toBeVisible();
});

test("renders links", async () => {
  const screen = await render(
    <richTextConfig.render
      {...createPuckProps()}
      content='<p>Visit <a href="https://example.com">our site</a></p>'
    />
  );

  expect(screen.getByText("our site")).toBeVisible();
});

test("renders empty content fallback", async () => {
  const screen = await render(
    <richTextConfig.render {...createPuckProps()} content="" />
  );

  const richTextDiv = screen.container.querySelector(".rich-text");
  expect(richTextDiv).toBeTruthy();
  expect(richTextDiv?.innerHTML).toBe("");
});

test("sanitizes dangerous javascript: URLs", async () => {
  const screen = await render(
    <richTextConfig.render
      {...createPuckProps()}
      content='<p><a href="javascript:alert(1)">Click me</a></p>'
    />
  );

  const link = screen.container.querySelector("a");
  expect(link?.getAttribute("href")).not.toBe("javascript:alert(1)");
});

test("allows safe https URLs", async () => {
  const screen = await render(
    <richTextConfig.render
      {...createPuckProps()}
      content='<p><a href="https://example.com">Safe link</a></p>'
    />
  );

  const link = screen.container.querySelector("a");
  expect(link?.getAttribute("href")).toBe("https://example.com");
});

test("renders blockquote", async () => {
  const screen = await render(
    <richTextConfig.render
      {...createPuckProps()}
      content="<blockquote><p>A wise quote</p></blockquote>"
    />
  );

  expect(screen.getByText("A wise quote")).toBeVisible();
});
