"use client";

import cn from "@lib/cn";
import { PageConfig } from "@lib/config/page.config";
import { usePuck } from "@puckeditor/core";
import { PanelLeft, PanelRight } from "lucide-react";
import { ReactNode } from "react";
import { CollapsibleMenu } from "./CollapsibleMenu";
import styles from "./PuckHeader.module.css";

type PuckHeaderProps = {
  headerTitle?: ReactNode;
  headerActions?: ReactNode;
};

function PuckHeader({ headerTitle, headerActions }: PuckHeaderProps) {
  const { dispatch } = usePuck<PageConfig>();

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
        "relative flex justify-between items-center px-2 sm:px-4 py-2 gap-2 sm:gap-4 border-b-2 border-primary"
      )}
    >
      {/* Sidebar toggles */}
      <div className="flex gap-1 sm:gap-2 shrink-0">
        <button
          className="w-6 h-6 cursor-pointer"
          onClick={toggleLeftSideBar}
          aria-label="Toggle Left Sidebar"
          title="Toggle Left Sidebar"
        >
          <PanelLeft size={24} />
        </button>
        <button
          className="w-6 h-6 cursor-pointer"
          onClick={toggleRightSideBar}
          aria-label="Toggle Right Sidebar"
          title="Toggle Right Sidebar"
        >
          <PanelRight size={24} />
        </button>
      </div>

      {/* Title - Truncate on small screens */}
      <div className="min-w-0 flex-1 sm:flex-none text-center sm:text-left">
        <h1 className="text-base sm:text-lg font-bold truncate max-w-[120px] sm:max-w-none">
          {headerTitle}
        </h1>
      </div>

{/* Collapsible menu for actions */}
      <CollapsibleMenu>{headerActions}</CollapsibleMenu>
    </header>
  );
}

export default PuckHeader;
