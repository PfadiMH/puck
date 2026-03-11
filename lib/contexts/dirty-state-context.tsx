"use client";
import { createContext, useContext } from "react";

export const DirtyStateContext = createContext<{
  isDirty: boolean;
  markClean: () => void;
}>({
  isDirty: false,
  markClean: () => {},
});

/**
 * Hook to check whether the editor has unsaved changes.
 */
export const useIsDirty = () => useContext(DirtyStateContext).isDirty;

/**
 * Hook to mark the editor state as clean (e.g. after saving).
 */
export const useMarkClean = () => useContext(DirtyStateContext).markClean;
