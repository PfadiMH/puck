"use client";
import { PageIdContext } from "@lib/contexts/page-id-context";
import { PropsWithChildren } from "react";

export const PageIdProvider = ({
  children,
  id,
}: PropsWithChildren<{ id: string }>) => {
  return (
    <PageIdContext.Provider value={{ id }}>{children}</PageIdContext.Provider>
  );
};
