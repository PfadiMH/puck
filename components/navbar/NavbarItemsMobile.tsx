"use client";
import { NavbarHamburgerSvg } from "@components/graphics/NavbarHamburgerSvg";
import ClickAwayListener from "@components/misc/ClickAwayListener";
import { NavbarLogo } from "@components/navbar/NavbarLogo";
import { NavbarData } from "@lib/config/navbar.config";
import { ReactNode, useId, useRef, useState } from "react";

export type NavbarComponentsProps = {
  navbarItems: ReactNode;
  data: NavbarData;
};

export function NavbarItemsMobile({
  navbarItems,
  data,
}: NavbarComponentsProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navbarOverlayId = useId();

  function handleClickAway(type: string, event: Event) {
    // Ignore clicks on the button
    if (buttonRef.current?.contains(event.target as Node)) return;

    setOpen(false);
  }
  const logo = data.root.props?.logo;
  return (
    <>
      <div className="md:hidden grid grid-cols-[1fr_min-content_1fr] border-b-[#edc600] border-b-8">
        <div></div> {/* Empty div to align logo */}
        <div className="relative z-20 w-28 h-28 mb-[-50px]">
          {logo && <NavbarLogo logo={logo} />}
        </div>
        <div className="flex items-center justify-end">
          <button
            ref={buttonRef}
            className="text-gray-500 w-10 h-10 relative mr-5 focus:outline-none border rounded-full border-dashed"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls={navbarOverlayId}
            aria-label="Open main menu"
          >
            <NavbarHamburgerSvg open={open} />
          </button>
        </div>
      </div>
      {open && (
        <div
          id={navbarOverlayId}
          className="md:hidden absolute z-10 overflow-auto w-full h-screen bg-[rgba(0,0,0,0.6)]"
        >
          <div className="py-20 px-2">
            <ClickAwayListener onClickAway={handleClickAway}>
              <div className="flex flex-col gap-3">{navbarItems}</div>
            </ClickAwayListener>
          </div>
        </div>
      )}
    </>
  );
}
