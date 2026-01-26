import { ActivityProps, activityConfig } from "@components/puck/Activity";
import { FlexProps, flexConfig } from "@components/puck/Flex";
import { GraphicProps, graphicConfig } from "@components/puck/Graphic";
import { HeadingProps, headingConfig } from "@components/puck/Heading";
import { HeroProps, heroConfig } from "@components/puck/Hero";
import { IFrameProps, iframeConfig } from "@components/puck/IFrame";
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
import type { Config, Data } from "@measured/puck";

// @keep-sorted
export type PageProps = {
  Activity: ActivityProps;
  Flex: FlexProps;
  Graphic: GraphicProps;
  Heading: HeadingProps;
  Hero: HeroProps;
  IFrame: IFrameProps;
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
    Activity: activityConfig,
    Flex: flexConfig,
    Graphic: graphicConfig,
    Heading: headingConfig,
    Hero: heroConfig,
    IFrame: iframeConfig,
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
