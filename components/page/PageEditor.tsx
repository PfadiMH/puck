"use client";
import PageHeaderActions from "@components/puck-overrides/PageHeaderActions";
import PuckHeader from "@components/puck-overrides/PuckHeader";
import { PageConfig, pageConfig, PageData } from "@lib/config/page.config";
import { DirtyStateContext } from "@lib/contexts/dirty-state-context";
import { Puck, usePuck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = useCallback(() => {
    setIsDirty(true);
  }, []);

  const markClean = useCallback(() => {
    setIsDirty(false);
  }, []);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const dirtyCtx = useMemo(
    () => ({ isDirty, markClean }),
    [isDirty, markClean],
  );

  return (
    <DirtyStateContext.Provider value={dirtyCtx}>
      <div className="puck-editor-wrapper">
        <Puck
          config={pageConfig}
          data={data}
          onChange={handleChange}
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
      </div>
    </DirtyStateContext.Provider>
  );
}
