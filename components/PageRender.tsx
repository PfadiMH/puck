// @ts-ignore - because for some reason it can't find the declaration file
import type { FooterConfig, FooterData } from "@config/footer.config";
import type { NavbarData } from "@config/navbar.config";
import type { PageConfig, PageData } from "@config/page.config";
import { Render } from "@measured/puck";
import { Navbar } from "./Navbar/Navbar";

export interface PageRenderProps {
  navbarData: NavbarData;
  pageConfig: PageConfig;
  pageData: PageData;
  footerConfig: FooterConfig;
  footerData: FooterData;
}

async function PageRender({
  navbarData,
  pageConfig,
  pageData,
  footerConfig,
  footerData,
}: PageRenderProps) {
  return (
    <>
      <Navbar data={navbarData} />
      <Render config={pageConfig} data={pageData} />
      <Render config={footerConfig} data={footerData} />
    </>
  );
}

export default PageRender;
