import { NavbarRender } from "@components/Navbar/NavbarRender";
import type { FooterConfig, FooterData } from "@config/footer.config";
import type { NavbarData } from "@config/navbar.config";
import type { PageConfig, PageData } from "@config/page.config";
import { Render } from "@measured/puck";

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
      <NavbarRender data={navbarData} />
      <Render config={pageConfig} data={pageData} />
      <Render config={footerConfig} data={footerData} />
    </>
  );
}

export default PageRender;
