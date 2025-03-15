"use client";
import { NavbarDropdownGroupedProps } from "@components/Navbar/NavbarDropdown";
import { NavbarDropdownArrowSvg } from "@components/Navbar/NavbarDropdownArrowSvg";
import { useState } from "react";

export function NavbarDropdownMobile({
  title,
  groupedItems,
  editMode = false,
}: NavbarDropdownGroupedProps & { editMode?: boolean }) {
  const [open, setOpen] = useState(editMode);
  const toggleOpen = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  return (
    <>
      <button
        onClick={toggleOpen}
        className="text-brand-yellow items-center gap-2 text-2xl font-rockingsoda bg-primary  w-full p-3 flex justify-center"
      >
        {title}
        <NavbarDropdownArrowSvg
          invertRotationDirection={true}
          open={open}
          className="fill-brand-yellow"
        />
      </button>
      {open && (
        <div className="px-4 flex gap-1 flex-col">
          {groupedItems.map((items, index) => (
            <div key={index} className="bg-primary w-full p-3">
              {items[0].groups_with && (
                <span className="text-xl font-rockingsoda">
                  {items[0].groups_with}
                </span>
              )}
              <div className="h-[1px] bg-brand-yellow"></div>

              {items.map((item, index) => (
                <a
                  key={index}
                  className="block text-center py-2"
                  href={item.url || undefined}
                >
                  {item.title}
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
