import { PageConfig, PageProps } from "@config/page.config";
import { ComponentConfig, Data, WithId, WithPuckProps } from "@measured/puck";
import { PropsWithChildren } from "react";
import { mapObjectEntries } from "./util";
import PuckSectionThemeUpdater from "@components/PuckSectionThemeUpdater";
import { SectionThemeProvider } from "@components/contexts/SectionThemeContext";
import SectionThemedComponent from "@components/SectionThemedComponent";

type PageData = Data<PageProps>;

export type Theme = "sun" | "mud";

export function applySectionTheming(data: PageData): {
  data: PageData;
  didChange: boolean;
} {
  // Alternate between sun and mud themes for each section, divided by the SectionDivider component
  let theme = "mud";
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
  const SectionThemedRender = <Props extends { theme?: Theme }>({
    theme,
    ...props
  }: WithId<WithPuckProps<Props>>) => {
    return (
      <SectionThemedComponent theme={theme}>
        <config.render {...props} />
      </SectionThemedComponent>
    );
  };

  return {
    ...config,
    render: SectionThemedRender,
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
      sectionThemedComponentConfig(value),
    ]),
  };
}
