import { createContext, useContext } from "react";

export const PageIdContext = createContext<{
  id: string;
}>({
  id: "",
});

export const usePageId = () => useContext(PageIdContext).id;
