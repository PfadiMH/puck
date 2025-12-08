import { ReactNode } from "react";
import { render, RenderResult } from "vitest-browser-react";
import TestWrapper from "../../testing/TestWrapper";

export function testRender(ui: ReactNode): Promise<RenderResult> {
  return render(ui, { wrapper: TestWrapper });
}
