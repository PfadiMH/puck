import { PageConfig, PageProps } from "@config/page.config";
import { ComponentConfig, Data, WithId, WithPuckProps } from "@measured/puck";
import { PropsWithChildren } from "react";
import { mapObjectEntries } from "./util";
import PuckSectionThemeUpdater from "@components/PuckSectionThemeUpdater";
import { ClientSectionThemeProvider } from "@components/contexts/ClientSectionThemeContext";
import { ServerSectionThemeProvider } from "@components/contexts/ServerSectionThemeContext";

type PageData = Data<PageProps>;

export type Theme = "sun" | "mud";

export function applySectionTheming(data: PageData): {
  data: PageData;
  didChange: boolean;
} {
  // Alternate between sun and mud themes for each section, divided by the SectionDivider component
  let theme = "sun";
  const newContent = [];
  let didChange = false;

  for (const item of data.content) {
    if (item.type === "SectionDivider") {
      theme = theme === "sun" ? "mud" : "sun";
    }
    if (item.props["theme"] !== theme) {
      didChange = true;
    }
    newContent.push({ ...item, props: { ...item.props, theme } });
  }

  return { data: { ...data, content: newContent }, didChange };
}

function RootRender<Props extends PropsWithChildren>({
  children,
  puck: { isEditing },
}: WithId<WithPuckProps<Props>>) {
  if (isEditing) {
    // Only add the data updater when editing (rendered on the client)
    return <PuckSectionThemeUpdater>{children}</PuckSectionThemeUpdater>;
  }
  return <>{children}</>;
}

function sectionThemedComponentConfig(
  config: ComponentConfig
): ComponentConfig {
  const SectionThemedComponent = <Props extends { theme?: Theme }>({
    theme,
    ...props
  }: WithId<WithPuckProps<Props>>) => {
    const isEditing = props.puck.isEditing;
    const SectionThemeProvider = isEditing ? ClientSectionThemeProvider : ServerSectionThemeProvider
    return (
      <fieldset
        style={{
          border: "1px solid purple",
          margin: "1rem",
          padding: "1rem",
        }}
      >
        <legend>SectionThemedComponent, theme: {theme}</legend>
        <SectionThemeProvider theme={theme}>
          <config.render {...props} />
        </SectionThemeProvider>
      </fieldset>
    );
  };

  return {
    ...config,
    render: SectionThemedComponent,
  };
}

export function sectionThemedConfig(config: PageConfig): PageConfig {
  return {
    ...config,
    root: {
      ...config.root,
      render: RootRender,
    },
    components: mapObjectEntries(config.components, <T,>([key, value]) => [
      key,
      key === "SectionDivider" ? value : sectionThemedComponentConfig(value),
    ]),
  };
}
