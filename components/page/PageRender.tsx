import { FooterRender } from "@components/footer/FooterRender";
import { PresunBreak } from "@components/graphics/SectionBreakSvgs";
import { NavbarRender } from "@components/navbar/NavbarRender";
import { EditPageButton } from "@components/page/EditPageButton";
import { FooterData } from "@lib/config/footer.config";
import { NavbarData } from "@lib/config/navbar.config";
import { pageConfig, PageData } from "@lib/config/page.config";
import { getLastSectionTheme } from "@lib/section-theming";
import { Render } from "@puckeditor/core";

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
  // Insert a section break before the footer when the last section is sun-themed,
  // to visually transition into the footer's fixed mud theme.
  const lastSectionTheme = getLastSectionTheme(pageData);

  return (
    <>
      <NavbarRender data={navbarData} />
      <Render config={pageConfig} data={pageData} />
      {lastSectionTheme === "sun" && <PresunBreak />}
      <FooterRender data={footerData} />
      <EditPageButton />
    </>
  );
}

export default PageRender;
