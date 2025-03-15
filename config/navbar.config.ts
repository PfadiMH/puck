import { uploadFile } from "@components/customFields/uploadFile";
import {
  navbarDropdownConfig,
  NavbarDropdownProps,
} from "@components/Navbar/NavbarDropdown";
import {
  navbarItemConfig,
  NavbarItemProps,
} from "@components/Navbar/NavbarItem";
import type { Config, Data } from "@measured/puck";

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
      logo: uploadFile,
    },
  },
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
