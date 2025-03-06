import type { Theme } from "@lib/sectionTheming";
import createServerContext from "@nimpl/context/create-server-context";
import getServerContext from "@nimpl/context/get-server-context";
import { PropsWithChildren } from "react";

export const ServerSectionThemeContext = createServerContext<{
  theme: Theme;
}>({
  theme: "sun",
});

export const getSectionTheme = () =>
  getServerContext(ServerSectionThemeContext).theme;

export const ServerSectionThemeProvider = ({
  children,
  theme,
}: PropsWithChildren<{ theme: Theme }>) => {
  return (
    <ServerSectionThemeContext.Provider value={{ theme }}>
      {children}
    </ServerSectionThemeContext.Provider>
  );
};
