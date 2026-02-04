"use client";

import cn from "@lib/cn";
import { ChevronUp } from "lucide-react";
import { ReactNode, useState } from "react";

type CollapsibleMenuProps = {
  children: ReactNode;
};

export function CollapsibleMenu({ children }: CollapsibleMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="sm:hidden">
        <button
          className="w-6 h-6 cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle Menu"
          title="Toggle Menu"
        >
          <ChevronUp
            size={24}
            className={cn(
              "transition duration-250 ease-in-out transform",
              !menuOpen && "rotate-180"
            )}
          />
        </button>
      </div>
      <div
        className={cn(
          "hidden absolute top-full left-0 right-0 bg-ground z-10 p-4 mt-[2px] border-b-2 border-primary",
          menuOpen ? "block" : "sm:block",
          "sm:static sm:border-0 sm:mt-0 sm:p-0 sm:bg-transparent"
        )}
      >
        {children}
      </div>
    </>
  );
}
