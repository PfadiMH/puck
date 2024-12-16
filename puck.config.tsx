import type { Config } from "@measured/puck";
import type { TextProps } from "./components/Text";
import Text from "./components/Text";
import type { HeadingProps } from "./components/Heading";
import { headingConfig } from "./components/Heading";

type Props = {
  Heading: HeadingProps
  HeadingBlock: { title: string };
  Text: TextProps;
};

export const config: Config<Props> = {
  components: {
    Text: {
      render: Text,
      fields: {
        text: {
          type: "textarea",
        },
      },
    },
    HeadingBlock: {
      fields: {
        title: { type: "text" },
      },
      defaultProps: {
        title: "Heading",
      },
      render: ({ title }) => (
        <div style={{ padding: 64 }}>
          <h1>{title}</h1>
        </div>
      ),
    },
    Heading: headingConfig,
  },
};

export default config;
