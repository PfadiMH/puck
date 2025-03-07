import navbarConfig, { NavbarData } from "@config/navbar.config";
import { Render } from "@measured/puck/rsc";
import { NavbarComponentsDesktop } from "./NavbarComponentsDesktop";
import { NavbarComponentsMobile } from "./NavbarComponentsMobile";

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
