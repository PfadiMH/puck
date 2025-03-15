import { Render } from "@measured/puck/rsc";
import type { NavbarConfig, NavbarData } from "@config/navbar.config";
import type { PageConfig, PageData } from "@config/page.config";
import type { FooterConfig, FooterData } from "@config/footer.config";

export interface PageRenderProps {
  navbarConfig: NavbarConfig;
  navbarData: NavbarData;
  pageConfig: PageConfig;
  pageData: PageData;
  footerConfig: FooterConfig;
  footerData: FooterData;
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
