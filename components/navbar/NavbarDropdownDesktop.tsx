"use client";
import { NavbarDropdownArrowSvg } from "@components/graphics/NavbarDropdownArrowSvg";
import ClickAwayListener from "@components/misc/ClickAwayListener";
import { NavbarDropdownGroupedProps } from "@components/puck/navbar/NavbarDropdown";
import { Fragment, useState } from "react";

export function NavbarDropdownDesktop({
  label,
  groupedItems,
}: NavbarDropdownGroupedProps) {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  return (
    <>
      <button
        onClick={toggleOpen}
        className="text-black flex items-center gap-1 text-2xl font-rockingsoda"
      >
        {label}
        <NavbarDropdownArrowSvg open={open} className="fill-black" />
      </button>
      {open && (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <div className="z-30 min-w-36 translate-y-4 drop-shadow-[0px_0px_1px_#000000] absolute items-center bg-white flex flex-col text-black font-rockingsoda text-2xl rounded-xl p-4 border-black b-2">
            <NavbarDropdownArrowSvg
              invertRotationDirection={true}
              open={open}
              className="fill-black"
            />
            {groupedItems.map((items, index) => (
              <Fragment key={index}>
                <div className="flex w-full gap-2 items-center">
                  <div className="grow h-[3px] bg-brand-yellow"></div>
                  {items[0].groups_with && (
                    <>
                      <span className="text-[16px] font-rockingsoda">
                        {items[0].groups_with}
                      </span>
                      <div className="grow min-w-3 h-[3px] bg-brand-yellow"></div>
                    </>
                  )}
                </div>

                {items.map((item, index) => (
                  <a
                    className="text-center"
                    href={item.url || undefined}
                    key={index}
                  >
                    {item.label}
                  </a>
                ))}
              </Fragment>
            ))}
          </div>
        </ClickAwayListener>
      )}
    </>
  );
}
