import { ActivityProps, activityConfig } from "@components/puck/Activity";
import {
  ButtonGroupProps,
  buttonGroupConfig,
} from "@components/puck/ButtonGroup";
import {
  CalendarSubscribeProps,
  calendarSubscribeConfig,
} from "@components/puck/CalendarSubscribe";
import { CardProps, cardConfig } from "@components/puck/Card";
import { FlexProps, flexConfig } from "@components/puck/Flex";
import { FormProps, formConfig } from "@components/puck/Form";
import { GraphicProps, graphicConfig } from "@components/puck/Graphic";
import { HeroProps, heroConfig } from "@components/puck/Hero";
import { IFrameProps, iframeConfig } from "@components/puck/IFrame";
import { RichTextProps, richTextConfig } from "@components/puck/RichText";
import {
  MultiColumnProps,
  multiColumnConfig,
} from "@components/puck/MultiColumn";
import {
  OrganigrammProps,
  organigrammConfig,
} from "@components/puck/Organigramm";
import {
  SectionDividerProps,
  sectionDividerConfig,
} from "@components/puck/SectionDivider";
import {
  VerticalSpaceProps,
  verticalSpaceConfig,
} from "@components/puck/VerticalSpace";
import { WebshopProps, webshopConfig } from "@components/puck/Webshop";
import { sectionThemedConfig } from "@lib/section-theming";
import type { Config, Data } from "@puckeditor/core";

// @keep-sorted
export type PageProps = {
  Activity: ActivityProps;
  ButtonGroup: ButtonGroupProps;
  CalendarSubscribe: CalendarSubscribeProps;
  Card: CardProps;
  Flex: FlexProps;
  Form: FormProps;
  Graphic: GraphicProps;
  Hero: HeroProps;
  IFrame: IFrameProps;
  MultiColumn: MultiColumnProps;
  Organigramm: OrganigrammProps;
  RichText: RichTextProps;
  SectionDivider: SectionDividerProps;
  VerticalSpace: VerticalSpaceProps;
  Webshop: WebshopProps;
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
    ButtonGroup: buttonGroupConfig,
    CalendarSubscribe: calendarSubscribeConfig,
    Card: cardConfig,
    Flex: flexConfig,
    Form: formConfig,
    Graphic: graphicConfig,
    Hero: heroConfig,
    IFrame: iframeConfig,
    MultiColumn: multiColumnConfig,
    Organigramm: organigrammConfig,
    RichText: richTextConfig,
    SectionDivider: sectionDividerConfig,
    VerticalSpace: verticalSpaceConfig,
    Webshop: webshopConfig,
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
