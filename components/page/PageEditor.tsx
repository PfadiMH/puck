"use client";
import { pageConfig, PageData } from "@lib/config/page.config";
import { savePage } from "@lib/db/database";
import { Puck } from "@measured/puck";
import PuckHeader from "./overrides/PuckHeader";

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
            onPublish={async (data) => {
              await savePage(path, data);
            }}
            path={path}
          />
        ),
      }}
    />
  );
}
