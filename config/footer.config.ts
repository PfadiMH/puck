import type { Config, Data } from "@measured/puck";
import type { TextProps } from "@components/Text";
import { textConfig } from "@components/Text";

// @keep-sorted
export type FooterProps = {
  Text: TextProps;
};
export type FooterRootProps = {};
export type FooterConfig = Config<FooterProps, FooterRootProps>;
export type FooterData = Data<FooterProps, FooterRootProps>;

export const footerConfig: FooterConfig = {
  // @keep-sorted
  components: {
    Text: textConfig,
  },
};

export const defaultFooterData: FooterData = {
  content: [],
  root: {
    props: {},
  },
};
