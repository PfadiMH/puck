import { ReactNode } from "react";
import { RenderResult, render as vitestRender } from "vitest-browser-react";
import TestWrapper from "../../testing/TestWrapper";

export function render(ui: ReactNode): Promise<RenderResult> {
  return vitestRender(ui, { wrapper: TestWrapper });
}
