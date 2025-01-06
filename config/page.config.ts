import type { Config } from "@measured/puck";
import type { TextProps } from "@components/Text";
import { textConfig } from "@components/Text";
import { heroConfig } from "@components/Hero";
import type { HeroProps } from "@components/Hero";
import { flexConfig, FlexProps } from "@components/Flex";

type Props = {
    Text: TextProps;
    Hero: HeroProps;
    Flex: FlexProps
};

export const config: Config<Props> = {
  components: {
    Text: textConfig,
    Hero: heroConfig,
    Flex: flexConfig,
  },
};

export default config;
