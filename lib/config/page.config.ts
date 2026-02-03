import { FlexProps, flexConfig } from "@components/puck/Flex";
import { GraphicProps, graphicConfig } from "@components/puck/Graphic";
import { HeadingProps, headingConfig } from "@components/puck/Heading";
import { HeroProps, heroConfig } from "@components/puck/Hero";
import { IFrameProps, iframeConfig } from "@components/puck/IFrame";
import { RichTextProps, richTextConfig } from "@components/puck/RichText";
import {
  SectionDividerProps,
  sectionDividerConfig,
} from "@components/puck/SectionDivider";
import { TextProps, textConfig } from "@components/puck/Text";
import {
  VerticalSpaceProps,
  verticalSpaceConfig,
} from "@components/puck/VerticalSpace";
import { sectionThemedConfig } from "@lib/section-theming";
import type { Config, Data } from "@puckeditor/core";

// @keep-sorted
export type PageProps = {
  Flex: FlexProps;
  Graphic: GraphicProps;
  Heading: HeadingProps;
  Hero: HeroProps;
  IFrame: IFrameProps;
  RichText: RichTextProps;
  SectionDivider: SectionDividerProps;
  Text: TextProps;
  VerticalSpace: VerticalSpaceProps;
};
export type PageRootProps = {
  title: string;
};
export type PageConfig = Config<PageProps, PageRootProps>;
export type PageData = Data<PageProps, PageRootProps>;

export const pageConfig: PageConfig = sectionThemedConfig({
  // @keep-sorted
  components: {
    Flex: flexConfig,
    Graphic: graphicConfig,
    Heading: headingConfig,
    Hero: heroConfig,
    IFrame: iframeConfig,
    RichText: richTextConfig,
    SectionDivider: sectionDividerConfig,
    Text: textConfig,
    VerticalSpace: verticalSpaceConfig,
  },
});

export const defaultPageData: PageData = {
  content: [],
  root: {
    props: {
      title: "New Page",
    },
  },
};
