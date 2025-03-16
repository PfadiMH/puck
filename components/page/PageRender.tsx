import { NavbarRender } from "@components/navbar/NavbarRender";
import { footerConfig, FooterData } from "@lib/config/footer.config";
import { NavbarData } from "@lib/config/navbar.config";
import { pageConfig, PageData } from "@lib/config/page.config";
import { Render } from "@measured/puck";

export interface PageRenderProps {
  navbarData: NavbarData;
  pageData: PageData;
  footerData: FooterData;
}

async function PageRender({
  navbarData,
  pageData,
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
