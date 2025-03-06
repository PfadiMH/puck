import type { Theme } from "@lib/sectionTheming";
import { PropsWithChildren } from "react";
import { ServerSectionThemeProvider } from "./ServerSectionThemeContext";
import { ClientSectionThemeProvider } from "./ClientSectionThemeContext";

function SectionThemeProvider({
  children,
  theme,
}: PropsWithChildren<{ theme: Theme }>) {
  return (
    <ServerSectionThemeProvider theme={theme}>
      <ClientSectionThemeProvider theme={theme}>
        {children}
      </ClientSectionThemeProvider>
    </ServerSectionThemeProvider>
  );
}

export default SectionThemeProvider;
