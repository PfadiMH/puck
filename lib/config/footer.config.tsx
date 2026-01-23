import {
  footerLinkGroupConfig,
  FooterLinkGroupProps,
} from "@components/puck/footer/FooterLinkGroup";
import {
  footerTextConfig,
  FooterTextProps,
} from "@components/puck/footer/FooterText";
import type { Config, Data } from "@measured/puck";
import type { PropsWithChildren } from "react";

// @keep-sorted
export type FooterProps = {
  FooterLinkGroup: FooterLinkGroupProps;
  FooterText: FooterTextProps;
};
export type FooterRootProps = {};
export type FooterConfig = Config<FooterProps, FooterRootProps>;
export type FooterData = Data<FooterProps, FooterRootProps>;

function FooterRoot({ children }: PropsWithChildren) {
  return (
    <>
      <style>{`
        /* Live site styles */
        .puck-footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          width: 100%;
          justify-items: center;
          text-align: center;
        }

        .puck-footer-grid > div {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        @media (min-width: 640px) {
          .puck-footer-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .puck-footer-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
      <div className="puck-footer-grid">
        {children}
      </div>
    </>
  );
}

export const footerConfig: FooterConfig = {
  root: {
    render: FooterRoot,
  },
  // @keep-sorted
  components: {
    FooterLinkGroup: footerLinkGroupConfig,
    FooterText: footerTextConfig,
  },
};

export const defaultFooterData: FooterData = {
  content: [],
  root: {
    props: {},
  },
};
