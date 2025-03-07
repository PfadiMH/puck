import {
  navbarDropdownConfig,
  NavbarDropdownProps,
} from "@components/Navbar/NavbarDropdown";
import {
  navbarItemConfig,
  NavbarItemProps,
} from "@components/Navbar/NavbarItem";
import { uploadFile } from "@components/customFields/uploadFile";
import type { Config, Data } from "@measured/puck";

type NavbarProps = {
  NavbarItem: NavbarItemProps;
  NavbarDropdown: NavbarDropdownProps;
};

type RootProps = {
  logo?: string;
};

const navbarConfig: Config<NavbarProps, RootProps> = {
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

export type NavbarData = Data<NavbarProps, RootProps>;
export default navbarConfig;
