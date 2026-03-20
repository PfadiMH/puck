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
import {
  DownloadButtonProps,
  downloadButtonConfig,
} from "@components/puck/DownloadButton";
import { FlexProps, flexConfig } from "@components/puck/Flex";
import { FormProps, formConfig } from "@components/puck/Form";
import { GalleryProps, galleryConfig } from "@components/puck/Gallery";
import { GraphicProps, graphicConfig } from "@components/puck/Graphic";
import { HeroProps, heroConfig } from "@components/puck/Hero";
import { IFrameProps, iframeConfig } from "@components/puck/IFrame";
import { ImageProps, imageConfig } from "@components/puck/Image";
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
  DownloadButton: DownloadButtonProps;
  Flex: FlexProps;
  Form: FormProps;
  Gallery: GalleryProps;
  Graphic: GraphicProps;
  Hero: HeroProps;
  IFrame: IFrameProps;
  Image: ImageProps;
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
  root: {
    fields: {
      title: {
        type: "text",
        label: "Title",
      },
    },
  },
  categories: {
    // All active components — Flex is deliberately excluded so it cannot be
    // added to new pages.  It remains registered in `components` so that
    // existing pages referencing it still render correctly.
    components: {
      components: [
        "Activity",
        "ButtonGroup",
        "CalendarSubscribe",
        "Card",
        "DownloadButton",
        "Form",
        "Gallery",
        "Graphic",
        "Hero",
        "IFrame",
        "Image",
        "MultiColumn",
        "Organigramm",
        "RichText",
        "SectionDivider",
        "VerticalSpace",
        "Webshop",
      ],
    },
    // Hide the auto-generated "other" bucket (contains deprecated Flex)
    other: { title: "Other", visible: false },
  },
  // @keep-sorted
  components: {
    Activity: activityConfig,
    ButtonGroup: buttonGroupConfig,
    CalendarSubscribe: calendarSubscribeConfig,
    Card: cardConfig,
    DownloadButton: downloadButtonConfig,
    Flex: flexConfig,
    Form: formConfig,
    Gallery: galleryConfig,
    Graphic: graphicConfig,
    Hero: heroConfig,
    IFrame: iframeConfig,
    Image: imageConfig,
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
