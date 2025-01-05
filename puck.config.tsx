import { DropZone, type Config } from "@measured/puck";
import type { TextProps } from "./components/Text";
import Text from "./components/Text";
import { Flex, FlexProps } from "./components/Flex";

type Props = {
  HeadingBlock: { title: string };
  Text: TextProps;
  Flex: FlexProps;
};


const config: Config<Props> = {
  components: {
    Flex, 
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
  },
};

export default config;