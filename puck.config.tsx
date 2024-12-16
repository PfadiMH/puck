import type { Config } from "@measured/puck";
import type { TextProps } from "./components/Text";
import Text from "./components/Text";
import type { HeadingProps } from "./components/Heading";
import { headingConfig } from "./components/Heading";

type Props = {
  Heading: HeadingProps
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
    Heading: headingConfig,
  },
};

export default config;
