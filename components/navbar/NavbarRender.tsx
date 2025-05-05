import { NavbarItemsDesktop } from "@components/navbar/NavbarItemsDesktop";
import { NavbarItemsMobile } from "@components/navbar/NavbarItemsMobile";
import { navbarConfig, NavbarData } from "@lib/config/navbar.config";
import { Render } from "@measured/puck";

type NavbarRenderProps = {
  data: NavbarData;
};

export function NavbarRender({ data }: NavbarRenderProps) {
  return (
    <nav className="bg-white sticky top-0 z-50 mud-theme">
      <NavbarItemsDesktop data={data} />
      <NavbarItemsMobile
        navbarItems={<Render config={navbarConfig} data={data} />}
        data={data}
      />
    </nav>
  );
}
