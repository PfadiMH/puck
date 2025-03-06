import React from "react";
import { Render } from "@measured/puck/rsc";
import type { Data } from "@measured/puck";
import type navbarConfig from "@config/navbar.config";
import type pageConfig from "@config/page.config";
import type footerConfig from "@config/footer.config";

export interface PageRenderProps {
  navbarConfig: typeof navbarConfig;
  navbarData: Data;
  pageConfig: typeof pageConfig;
  pageData: Data;
  footerConfig: typeof footerConfig;
  footerData: Data;
}

async function PageRender({
  navbarConfig,
  navbarData,
  pageConfig,
  pageData,
  footerConfig,
  footerData,
}: PageRenderProps) {
  return (
    <>
      <Render config={navbarConfig} data={navbarData} />
      <Render config={pageConfig} data={pageData} />
      <Render config={footerConfig} data={footerData} />
    </>
  );
}

export default PageRender;
