import { filePickerField } from "@components/puck-fields/file-picker";
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
      logo: filePickerField,
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

// Re-exported from navbar.defaults.ts for backward compat.
// DB implementations import from navbar.defaults.ts directly to avoid
// pulling in the component dependency tree.
export { defaultNavbarData } from "./navbar.defaults";
