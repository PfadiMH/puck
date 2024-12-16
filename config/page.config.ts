import type { Config } from "@measured/puck";
import { textConfig } from "@components/Text";
import type { TextProps } from "@components/Text";
import { heroConfig } from "@components/Hero";
import type { HeroProps } from "@components/Hero";
import { VerticalSpace } from "@components/VerticalSpace";
import type { VerticalSpaceProps } from "@components/VerticalSpace";


type Props = {
    Text: TextProps;
    Hero: HeroProps;
    VerticalSpace: VerticalSpaceProps;
};

export const config: Config<Props> = {
    components: {
        Text: textConfig,
        Hero: heroConfig,
        VerticalSpace: VerticalSpace,
    },
};

export default config;
