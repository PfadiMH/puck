import { NavbarItemsDesktop } from "@components/Navbar/NavbarItemsDesktop";
import { NavbarItemsMobile } from "@components/Navbar/NavbarItemsMobile";
import { navbarConfig, NavbarData } from "@config/navbar.config";
import { Render } from "@measured/puck";

export type NavbarProps = {
  data: NavbarData;
};

export function NavbarRender({ data }: NavbarProps) {
  return (
    <nav className="bg-white sticky top-0 z-50">
      <NavbarItemsDesktop data={data} />
      <NavbarItemsMobile
        navbarItems={<Render config={navbarConfig} data={data} />}
        data={data}
      />
    </nav>
  );
}
