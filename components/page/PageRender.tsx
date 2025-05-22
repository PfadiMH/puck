import { PageIdProvider } from "@components/contexts/PageIdProvider";
import { NavbarRender } from "@components/navbar/NavbarRender";
import { footerConfig, FooterData } from "@lib/config/footer.config";
import { NavbarData } from "@lib/config/navbar.config";
import { DocumentData, pageConfig } from "@lib/config/page.config";
import { Render } from "@measured/puck";

export interface PageRenderProps {
  navbarData: NavbarData;
  document: DocumentData;
  footerData: FooterData;
}

async function PageRender({
  navbarData,
  document,
  footerData,
}: PageRenderProps) {
  return (
    <PageIdProvider id={document.id}>
      <NavbarRender data={navbarData} />
      <Render config={pageConfig} data={document} />
      <Render config={footerConfig} data={footerData} />
    </PageIdProvider>
  );
}

export default PageRender;
