import type { Config, Data } from "@measured/puck";
import type { TextProps } from "@components/Text";
import { textConfig } from "@components/Text";

export type NavbarProps = {
  Text: TextProps;
};
export type NavbarRootProps = {};
export type NavbarConfig = Config<NavbarProps, NavbarRootProps>;
export type NavbarData = Data<NavbarProps, NavbarRootProps>;

export const navbarConfig: NavbarConfig = {
  components: {
    Text: textConfig,
  },
};

export const defaultNavbarData: NavbarData = {
  content: [],
  root: {
    props: {},
  },
};
