"use client";
import PageHeaderActions from "@components/puck-overrides/PageHeaderActions";
import PuckHeader from "@components/puck-overrides/PuckHeader";
import { PageConfig, pageConfig, PageData } from "@lib/config/page.config";
import { Puck, usePuck } from "@measured/puck";

type HeaderTitleProps = {
  path: string;
};

function HeaderTitle({ path }: HeaderTitleProps) {
  const {
    appState: { data },
  } = usePuck<PageConfig>();
  const title = data?.root?.props?.title;
  return `Editing ${path}${title ? `: ${title}` : ""}`;
}

type PageEditorProps = {
  path: string;
  data: PageData;
};

export function PageEditor({ path, data }: PageEditorProps) {
  return (
    <Puck
      config={pageConfig}
      data={data}
      headerPath={path}
      overrides={{
        header: () => (
          <PuckHeader
            headerTitle={<HeaderTitle path={path} />}
            headerActions={<PageHeaderActions path={path} />}
          />
        ),
      }}
    />
  );
}
