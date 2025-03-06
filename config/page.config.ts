import type { Config } from "@measured/puck";
import { textConfig } from "@components/Text";
import type { TextProps } from "@components/Text";
import { heroConfig } from "@components/Hero";
import type { HeroProps } from "@components/Hero";
import type { HeadingProps } from "@components/Heading";
import { headingConfig } from "@components/Heading";
import { verticalSpaceConfig } from "@components/VerticalSpace";
import type { VerticalSpaceProps } from "@components/VerticalSpace";
import { iframeConfig } from "@components/IFrame";
import type { IFrameProps } from "@components/IFrame";
import { flexConfig } from "@components/Flex";
import { FlexProps } from "@components/Flex";
import {
  sectionDividerConfig,
  SectionDividerProps,
} from "@components/SectionDivider";
import { sectionThemedConfig } from "@lib/sectionTheming";

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
  }
});

export default config;
