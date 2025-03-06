"use client";

import { PageConfig } from "@config/page.config";
import { applySectionTheming } from "@lib/sectionTheming";
import { usePuck } from "@measured/puck";
import React, { PropsWithChildren, useEffect, useMemo } from "react";

function PuckSectionThemeUpdater({ children }: PropsWithChildren<{}>) {
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

export default PuckSectionThemeUpdater;
