"use client";

import cn from "@lib/cn";
import { PageConfig } from "@lib/config/page.config";
import { usePuck } from "@measured/puck";
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

      <div>
        <h1 className="text-lg font-bold">{headerTitle}</h1>
      </div>

      <CollapsibleMenu>{headerActions}</CollapsibleMenu>
    </header>
  );
}

export default PuckHeader;
