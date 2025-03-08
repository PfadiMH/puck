import type { TextProps } from "@components/Text";
import { textConfig } from "@components/Text";
import type { Config } from "@measured/puck";

type FooterProps = {
  Text: TextProps;
};

const footerConfig: Config<FooterProps> = {
  components: {
    Text: textConfig,
  },
};

export default footerConfig;
