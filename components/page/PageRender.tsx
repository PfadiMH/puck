import { FooterRender } from "@components/footer/FooterRender";
import { NavbarRender } from "@components/navbar/NavbarRender";
import { FooterData } from "@lib/config/footer.config";
import { NavbarData } from "@lib/config/navbar.config";
import { pageConfig, PageData } from "@lib/config/page.config";
import { getLastSectionTheme } from "@lib/section-theming";
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
  // Footer theme is the opposite of the last section's theme
  const lastSectionTheme = getLastSectionTheme(pageData);
  const footerTheme = lastSectionTheme === "sun" ? "mud" : "sun";

  return (
    <>
      <NavbarRender data={navbarData} />
      <Render config={pageConfig} data={pageData} />
      <FooterRender data={footerData} theme={footerTheme} />
    </>
  );
}

export default PageRender;
