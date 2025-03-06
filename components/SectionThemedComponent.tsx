import React, { PropsWithChildren } from "react";
import { SectionThemeProvider } from "./contexts/SectionThemeContext";
import { Theme } from "@lib/sectionTheming";

function SectionThemedComponent({
  children,
  theme,
}: PropsWithChildren<{ theme: Theme }>) {
  return (
    <SectionThemeProvider theme={theme}>
      <div
        className={`${theme}-theme`}
        style={{
          backgroundColor: "var(--color-background)",
        }}
      >
        {children}
      </div>
    </SectionThemeProvider>
  );
}

export default SectionThemedComponent;
