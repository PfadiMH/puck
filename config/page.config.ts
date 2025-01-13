import type { Config } from "@measured/puck";
import type { TextProps } from "@components/Text";
import { textConfig } from "@components/Text";
import { heroConfig } from "@components/Hero";
import type { HeroProps } from "@components/Hero";
import { ButtonGroupProps, buttonGroupConfig } from "@components/ButtonGroup";

type Props = {
    Text: TextProps;
    Hero: HeroProps;
    ButtonGroup: ButtonGroupProps;
};

export const config: Config<Props> = {
    components: {
        Text: textConfig,
        Hero: heroConfig,
        ButtonGroup: buttonGroupConfig,
    },
};

export default config;
