import type footerConfig from "@config/footer.config";
import { NavbarData } from "@config/navbar.config";
import type pageConfig from "@config/page.config";
import type { Data } from "@measured/puck";
import { Render } from "@measured/puck/rsc";
import { Navbar } from "./Navbar/Navbar";

export interface PageRenderProps {
  navbarData: NavbarData;
  pageConfig: typeof pageConfig;
  pageData: Data;
  footerConfig: typeof footerConfig;
  footerData: Data;
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
