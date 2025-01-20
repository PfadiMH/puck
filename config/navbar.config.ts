import type { Config } from "@measured/puck";
import type { TextProps } from "@components/Text";
import { textConfig } from "@components/Text";

type NavbarProps = {
  Text: TextProps;
};

const navbarConfig: Config<NavbarProps> = {
  components: {
    Text: textConfig,
  },
};

export default navbarConfig;
