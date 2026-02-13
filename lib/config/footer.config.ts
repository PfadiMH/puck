import type { RichTextProps } from "@components/puck/RichText";
import { richTextConfig } from "@components/puck/RichText";
import type { Config, Data } from "@puckeditor/core";

// @keep-sorted
export type FooterProps = {
  RichText: RichTextProps;
};
export type FooterRootProps = {};
export type FooterConfig = Config<FooterProps, FooterRootProps>;
export type FooterData = Data<FooterProps, FooterRootProps>;

export const footerConfig: FooterConfig = {
  // @keep-sorted
  components: {
    RichText: richTextConfig,
  },
};

export const defaultFooterData: FooterData = {
  content: [],
  root: {
    props: {},
  },
};
