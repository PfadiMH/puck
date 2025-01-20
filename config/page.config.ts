import type { Config } from "@measured/puck";
import { textConfig } from "@components/Text";
import type { TextProps } from "@components/Text";
import { heroConfig } from "@components/Hero";
import type { HeroProps } from "@components/Hero";
import type { ButtonGroupProps } from "@components/ButtonGroup";
import { buttonGroupConfig } from "@components/ButtonGroup";

import { verticalSpaceConfig } from "@components/VerticalSpace";
import type { VerticalSpaceProps } from "@components/VerticalSpace";


type Props = {
    Text: TextProps;
    Hero: HeroProps;
    VerticalSpace: VerticalSpaceProps;
    ButtonGroup: ButtonGroupProps;
};

export const config: Config<Props> = {
    components: {
        Text: textConfig,
        Hero: heroConfig,
        VerticalSpace: verticalSpaceConfig,
        ButtonGroup: buttonGroupConfig,
    },
};

export default config;
