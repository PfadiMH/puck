import type { TextProps } from "@components/puck/Text";
import { textConfig } from "@components/puck/Text";
import type { Config, Data } from "@puckeditor/core";

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
