"use client";
import { CollapseSvg } from "@components/graphics/CollapseSvg";
import LeftSideBarSvg from "@components/graphics/LeftSideBarSvg";
import RightSideBarSvg from "@components/graphics/RightSideBarSvg";
import cn from "@lib/cn";
import { PageConfig, PageData } from "@lib/config/page.config";
import { usePuck } from "@measured/puck";
import { PropsWithChildren, useState } from "react";
import styles from "./PuckHeader.module.css";
import PuckHeaderActions from "./PuckHeaderActions";

type PuckHeaderProps = {
  path: string;
  onPublish: (data: PageData) => Promise<void>;
};

function PuckHeader({ path }: PropsWithChildren<PuckHeaderProps>) {
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    dispatch,
    appState: { data },
  } = usePuck<PageConfig>();

  const toggleLeftSideBar = () => {
    dispatch({
      type: "setUi",
      ui: ({ leftSideBarVisible }) => ({
        leftSideBarVisible: !leftSideBarVisible,
      }),
    });
  };

  const toggleRightSideBar = () => {
    dispatch({
      type: "setUi",
      ui: ({ rightSideBarVisible }) => ({
        rightSideBarVisible: !rightSideBarVisible,
      }),
    });
  };

  return (
    <header
      className={cn(
        styles.header,
        "relative flex justify-between items-center px-4 py-2 gap-4 border-b-2 border-primary"
      )}
    >
      <div className="flex gap-2">
        <button
          className="w-6 h-6 cursor-pointer"
          onClick={toggleLeftSideBar}
          aria-label="Toggle Left Sidebar"
          title="Toggle Left Sidebar"
        >
          <LeftSideBarSvg />
        </button>
        <button
          className="w-6 h-6 cursor-pointer"
          onClick={toggleRightSideBar}
          aria-label="Toggle Right Sidebar"
          title="Toggle Right Sidebar"
        >
          <RightSideBarSvg />
        </button>
      </div>

      <div>
        <h1 className="text-lg font-bold">
          Editing {path}: {data.root?.props?.title}
        </h1>
      </div>
      <div className="sm:hidden">
        <button
          className="w-6 h-6 cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle Menu"
          title="Toggle Menu"
        >
          <CollapseSvg open={menuOpen} />
        </button>
      </div>
      <div
        className={cn(
          "hidden absolute top-full left-0 right-0 bg-ground z-10 p-4 mt-[2px] border-b-2 border-primary",
          menuOpen ? "block" : "sm:block",
          "sm:static sm:border-0 sm:mt-0 sm:p-0 sm:bg-transparent"
        )}
      >
        <PuckHeaderActions path={path} />
      </div>
    </header>
  );
}

export default PuckHeader;
