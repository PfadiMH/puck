import {
  navbarDropdownConfig,
  NavbarDropdownProps,
} from "@components/puck/navbar/NavbarDropdown";
import {
  navbarItemConfig,
  NavbarItemProps,
} from "@components/puck/navbar/NavbarItem";
import { uploadFileField } from "@lib/config/custom-fields/upload-file";
import type { Config, Data } from "@measured/puck";

// @keep-sorted
export type NavbarProps = {
  NavbarItem: NavbarItemProps;
  NavbarDropdown: NavbarDropdownProps;
};
export type NavbarRootProps = {
  logo?: string;
};
export type NavbarConfig = Config<NavbarProps, NavbarRootProps>;
export type NavbarData = Data<NavbarProps, NavbarRootProps>;

export const navbarConfig: NavbarConfig = {
  root: {
    fields: {
      logo: uploadFileField,
    },
  },
  // @keep-sorted
  components: {
    NavbarItem: navbarItemConfig,
    NavbarDropdown: navbarDropdownConfig,
  },
};

export const defaultNavbarData: NavbarData = {
  content: [],
  root: {
    props: {},
  },
};
