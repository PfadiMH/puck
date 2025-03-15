import { NavbarComponentsDesktop } from "@components/Navbar/NavbarComponentsDesktop";
import { NavbarComponentsMobile } from "@components/Navbar/NavbarComponentsMobile";
import { navbarConfig, NavbarData } from "@config/navbar.config";
import { Render } from "@measured/puck";

export type NavbarProps = {
  data: NavbarData;
};

export function Navbar({ data }: NavbarProps) {
  return (
    <nav className="bg-white sticky top-0 z-50">
      <NavbarComponentsDesktop data={data} />
      <NavbarComponentsMobile
        navbarItems={<Render config={navbarConfig} data={data} />}
        data={data}
      />
    </nav>
  );
}
