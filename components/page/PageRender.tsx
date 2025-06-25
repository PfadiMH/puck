import { PageIdProvider } from "@components/contexts/PageIdProvider";
import { NavbarRender } from "@components/navbar/NavbarRender";
import { footerConfig, FooterData } from "@lib/config/footer.config";
import { NavbarData } from "@lib/config/navbar.config";
import { pageConfig } from "@lib/config/page.config";
import { PageDocument } from "@lib/db/database";
import { Render } from "@measured/puck";

export interface PageRenderProps {
  navbarData: NavbarData;
  page: PageDocument;
  footerData: FooterData;
}

async function PageRender({ navbarData, page, footerData }: PageRenderProps) {
  return (
    <PageIdProvider id={page.id}>
      <NavbarRender data={navbarData} />
      <Render config={pageConfig} data={page.data} />
      <Render config={footerConfig} data={footerData} />
    </PageIdProvider>
  );
}

export default PageRender;
