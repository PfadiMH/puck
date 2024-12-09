import type { Config } from "@measured/puck";
import type { TextProps } from "./components/Text";
import Text from "./components/Text";
import { headingComponentConfig, HeadingComponentProps } from "./components/HeadingComponent";

type Props = {
  HeadingComponent: HeadingComponentProps
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
    HeadingComponent: headingComponentConfig,
  },
};

export default config;
