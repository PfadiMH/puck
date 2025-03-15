"use client";
import ClickAwayListener from "@components/helperComponents/ClickAwayListener";
import { NavbarDropdownGroupedProps } from "@components/Navbar/NavbarDropdown";
import { NavbarDropdownArrowSvg } from "@components/Navbar/NavbarDropdownArrowSvg";
import { Fragment, useState } from "react";

export function NavbarDropdownDesktop({
  title,
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
        {title}
        <NavbarDropdownArrowSvg open={open} className="fill-black" />
      </button>
      {open && (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <div className="z-30 min-w-36 translate-y-4 drop-shadow-[0px_0px_1px_#000000] absolute items-center bg-white flex flex-col text-black font-rockingsoda text-2xl rounded-xl p-4 border-black b-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52.36 24.43"
              className=" absolute w-10 h-10 -translate-x-8 -translate-y-[43.4px] z-20 pointer-events-none"
            >
              <path
                stroke="none"
                fill="white"
                d="M0,22c.18,0,15.99.01,17.77-21.53-.01-.5.67-.65.87-.2,1.72,4.02,5.6,11.55,11.83,15.62,8.27,5.38,16.59,6.13,21.89,6.13,0,.02-50.12-.02-52.36-.02Z"
              />
            </svg>
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
                    {item.title}
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
