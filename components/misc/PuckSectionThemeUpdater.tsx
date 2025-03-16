"use client";
import { PageConfig } from "@lib/config/page.config";
import { applySectionTheming } from "@lib/section-theming";
import { usePuck } from "@measured/puck";
import { PropsWithChildren, useEffect, useMemo } from "react";

/**
 * In the editor, updates Puck state with section themes, alternating based on
 * `SectionDivider` components, dispatching only when a change is required.
 */
export function PuckSectionThemeUpdater({ children }: PropsWithChildren<{}>) {
  const {
    appState: { data },
    dispatch,
  } = usePuck<PageConfig>();

  const { data: updatedAppData, didChange } = useMemo(
    () => applySectionTheming(data),
    [data]
  );

  useEffect(() => {
    if (!didChange) return;
    dispatch({ type: "setData", data: updatedAppData });
  }, [updatedAppData, didChange, dispatch]);

  return <>{children}</>;
}
