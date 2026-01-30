import { filePickerWithMetaField } from "@components/puck-fields/file-picker-with-meta";
import {
  navbarDropdownConfig,
  NavbarDropdownProps,
} from "@components/puck/navbar/NavbarDropdown";
import {
  navbarItemConfig,
  NavbarItemProps,
} from "@components/puck/navbar/NavbarItem";
import type { FileSelection } from "@lib/storage/file-record";
import type { Config, Data } from "@measured/puck";

// @keep-sorted
export type NavbarProps = {
  NavbarDropdown: NavbarDropdownProps;
  NavbarItem: NavbarItemProps;
};
export type NavbarRootProps = {
  /** Logo can be FileSelection (new) or string (legacy base64/URL) for backward compatibility */
  logo?: FileSelection | string | null;
};
export type NavbarConfig = Config<NavbarProps, NavbarRootProps>;
export type NavbarData = Data<NavbarProps, NavbarRootProps>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const navbarConfig: NavbarConfig = {
  root: {
    fields: {
      // Field outputs FileSelection, but we accept string for backward compatibility with legacy data
      logo: {
        ...filePickerWithMetaField,
        label: "Logo",
      } as any,
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
    props: {},
  },
};
