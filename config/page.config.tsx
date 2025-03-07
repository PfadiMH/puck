import { flexConfig, FlexProps } from "@components/Flex";
import type { HeadingProps } from "@components/Heading";
import { headingConfig } from "@components/Heading";
import type { HeroProps } from "@components/Hero";
import { heroConfig } from "@components/Hero";
import type { IFrameProps } from "@components/IFrame";
import { iframeConfig } from "@components/IFrame";
import {
  sectionDividerConfig,
  SectionDividerProps,
} from "@components/SectionDivider";
import type { TextProps } from "@components/Text";
import { textConfig } from "@components/Text";
import type { VerticalSpaceProps } from "@components/VerticalSpace";
import { verticalSpaceConfig } from "@components/VerticalSpace";
import { sectionThemedConfig } from "@lib/sectionTheming";
import { type Config } from "@measured/puck";

export type PageProps = {
  Heading: HeadingProps;
  Text: TextProps;
  Hero: HeroProps;
  VerticalSpace: VerticalSpaceProps;
  Flex: FlexProps;
  IFrame: IFrameProps;
  SectionDivider: SectionDividerProps;
};

export type PageConfig = Config<PageProps, {}>;

export const config: PageConfig = sectionThemedConfig({
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

export default config;
