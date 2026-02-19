import { uploadFileField } from "@components/puck-fields/upload-file";
import {
  navbarDropdownConfig,
  NavbarDropdownProps,
} from "@components/puck/navbar/NavbarDropdown";
import {
  navbarItemConfig,
  NavbarItemProps,
} from "@components/puck/navbar/NavbarItem";
import type { Config, Data } from "@puckeditor/core";

// @keep-sorted
export type NavbarProps = {
  NavbarDropdown: NavbarDropdownProps;
  NavbarItem: NavbarItemProps;
};
export type NavbarRootProps = {
  logo?: string;
  enableSearch?: string;
};
export type NavbarConfig = Config<NavbarProps, NavbarRootProps>;
export type NavbarData = Data<NavbarProps, NavbarRootProps>;

export const navbarConfig: NavbarConfig = {
  root: {
    fields: {
      logo: uploadFileField,
      enableSearch: {
        type: "radio",
        label: "Enable Search",
        options: [
          { label: "Enabled", value: "true" },
          { label: "Disabled", value: "false" },
        ],
      },
    },
  },
  // @keep-sorted
  components: {
    NavbarDropdown: navbarDropdownConfig,
    NavbarItem: navbarItemConfig,
  },
};

export const defaultNavbarData: NavbarData = {
  content: [],
  root: {
    props: { enableSearch: "false" },
  },
};
