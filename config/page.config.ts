import { FlexProps, flexConfig } from "@components/Flex";
import { HeadingProps, headingConfig } from "@components/Heading";
import { HeroProps, heroConfig } from "@components/Hero";
import { IFrameProps, iframeConfig } from "@components/IFrame";
import {
  SectionDividerProps,
  sectionDividerConfig,
} from "@components/SectionDivider";
import { TextProps, textConfig } from "@components/Text";
import {
  VerticalSpaceProps,
  verticalSpaceConfig,
} from "@components/VerticalSpace";
import { sectionThemedConfig } from "@lib/sectionTheming";
import type { Config, Data } from "@measured/puck";

export type PageProps = {
  Heading: HeadingProps;
  Text: TextProps;
  Hero: HeroProps;
  VerticalSpace: VerticalSpaceProps;
  Flex: FlexProps;
  IFrame: IFrameProps;
  SectionDivider: SectionDividerProps;
};
export type PageRootProps = {
  title: string;
};
export type PageConfig = Config<PageProps, PageRootProps>;
export type PageData = Data<PageProps, PageRootProps>;

export const pageConfig: PageConfig = sectionThemedConfig({
  components: {
    Heading: headingConfig,
    Text: textConfig,
    Hero: heroConfig,
    VerticalSpace: verticalSpaceConfig,
    Flex: flexConfig,
    IFrame: iframeConfig,
    SectionDivider: sectionDividerConfig,
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
