import {
  footerColumnsConfig,
  FooterColumnsProps,
} from "@components/puck/footer/FooterColumns";
import {
  footerLinkGroupConfig,
  FooterLinkGroupProps,
} from "@components/puck/footer/FooterLinkGroup";
import {
  footerTextConfig,
  FooterTextProps,
} from "@components/puck/footer/FooterText";
import type { Config, Data } from "@puckeditor/core";
import type { PropsWithChildren } from "react";

// @keep-sorted
export type FooterProps = {
  FooterColumns: FooterColumnsProps;
  FooterLinkGroup: FooterLinkGroupProps;
  FooterText: FooterTextProps;
};
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Puck's Data generic requires {} here; Record<string, never> is incompatible with its internal types
export type FooterRootProps = {};
export type FooterConfig = Config<FooterProps, FooterRootProps>;
export type FooterData = Data<FooterProps, FooterRootProps>;

function FooterRoot({ children }: PropsWithChildren) {
  return <div className="w-full">{children}</div>;
}

export const footerConfig: FooterConfig = {
  root: {
    render: FooterRoot,
  },
  // @keep-sorted
  components: {
    FooterColumns: footerColumnsConfig,
    FooterLinkGroup: footerLinkGroupConfig,
    FooterText: footerTextConfig,
  },
};

export const defaultFooterData: FooterData = {
  content: [
    {
      type: "FooterColumns",
      props: {
        id: "footer-columns-1",
        columns: [{ id: "1" }, { id: "2" }, { id: "3" }],
      },
    },
  ],
  root: {
    props: {},
  },
};
