import { PageConfig, PageData } from "@config/page.config";
import { WithId, WithPuckProps } from "@measured/puck";
import { ComponentProps, JSX, PropsWithChildren } from "react";
import { mapObjectEntries } from "./util";
import PuckSectionThemeUpdater from "@components/PuckSectionThemeUpdater";
import SectionThemedComponent from "@components/SectionThemedComponent";

export type Theme = "sun" | "mud";

/**
 * This function takes a page data object and applies section theming to it. It
 * alternates between sun and mud themes for each section, divided by the
 * `SectionDivider` component.
 */
export function applySectionTheming(data: PageData): {
  data: PageData;
  didChange: boolean;
} {
  // Alternate between sun and mud themes for each section, divided by the SectionDivider component
  let theme = "mud";
  const newContent: PageData["content"] = [];
  let didChange = false;

  for (const item of data.content) {
    if (item.type === "SectionDivider") {
      theme = theme === "sun" ? "mud" : "sun";
    }
    if (!("theme" in item.props) || item.props["theme"] !== theme) {
      didChange = true;
    }
    newContent.push({
      ...item,
      props: { ...item.props, theme } as any, // Smelly workaround >_<
    });
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

/**
 * This function wraps a component render function in a `SectionThemedComponent`
 * that applies and provides the theme context.
 */
function sectionThemedComponentConfig<K extends keyof PageConfig["components"]>(
  config: PageConfig["components"][K]
): PageConfig["components"][K] {
  const SectionThemedRender = ({
    ...props
  }: ComponentProps<typeof config.render> &
    JSX.IntrinsicAttributes & {
      theme?: Theme;
    }) => {
    return (
      <SectionThemedComponent theme={props.theme ?? "mud"}>
        <config.render {...props} />
      </SectionThemedComponent>
    );
  };

  return {
    ...config,
    render: SectionThemedRender,
  };
}

/**
 * This function takes a page config and returns a new page config with
 * modifications to add a root render function and wrap each component render
 * function in a `SectionThemedComponent`.
 */
export function sectionThemedConfig(config: PageConfig): PageConfig {
  return {
    ...config,
    root: {
      ...config.root,
      render: RootRender,
    },
    components: mapObjectEntries(
      config.components,
      ([key, componentConfig]) => [
        key,
        sectionThemedComponentConfig(componentConfig),
      ]
    ),
  };
}
