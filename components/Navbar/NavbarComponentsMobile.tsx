"use client";
import ClickAwayListener from "@components/helperComponents/ClickAwayListener";
import { NavbarData } from "@config/navbar.config";
import { ReactNode, useId, useRef, useState } from "react";

export type NavbarComponentsProps = {
  navbarItems: ReactNode;
  data: NavbarData;
};

export function NavbarComponentsMobile({
  navbarItems,
  data,
}: NavbarComponentsProps) {
  const [open, setOpen] = useState(false);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const navbarOverlayId = useId();

  function handleClickAway(type: string, event: Event) {
    // Ignore clicks on the button
    if (mobileButtonRef.current?.contains(event.target as Node)) return;

    setOpen(false);
  }
  const logo = data.root.props?.logo;
  return (
    <>
      {open && (
        <div
          id={navbarOverlayId}
          className="md:hidden block absolute z-10 overflow-auto w-full h-screen bg-[rgba(0,0,0,0.6)] mb-[-900px]"
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
