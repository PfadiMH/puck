"use client";
import { navbarConfig, NavbarData } from "@config/navbar.config";
import { Render } from "@measured/puck";
import { NavbarLogo } from "./NavbarLogo";

export type NavbarProps = {
  data: NavbarData;
};

export function Navbar({ data }: NavbarProps) {
  const { desktopLeftItems, desktopRightItems } = splitData(data);

  return (
    <nav className="bg-white sticky top-0 z-50 border-b-[#F4D51F] border-b-8 grid grid-cols-[1fr_min-content_1fr] gap-4 items-end">
      {/* Desktop */}
      <div className="hidden md:flex justify-end gap-4 flex-wrap mb-1">
        <Render config={navbarConfig} data={desktopLeftItems} />
      </div>

      {/* Mobile */}
      <div className="md:hidden block"></div>

      {/* Logo */}
      <NavbarLogo logo={data.root.props?.logo} />

      {/* Desktop */}
      <div className="hidden md:flex justify-start gap-4 flex-wrap mb-1">
        <Render config={navbarConfig} data={desktopRightItems} />
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center justify-end"></div>
    </nav>
  );
}

function splitData(data: NavbarData): {
  desktopLeftItems: NavbarData;
  desktopRightItems: NavbarData;
} {
  const halfLength = Math.ceil(data.content.length / 2);
  return {
    desktopLeftItems: {
      ...data,
      content: data.content.slice(0, halfLength),
    },
    desktopRightItems: {
      ...data,
      content: data.content.slice(halfLength),
    },
  };
}
