import type { Config } from "@measured/puck";
import type { TextProps } from "@components/Text";
import { textConfig } from "@components/Text";
import { heroConfig } from "@components/Hero";
import type { HeroProps } from "@components/Hero";
import { HeadingProps} from "@components/Heading";
import { headingConfig } from "@components/Heading";

type Props = {

    Heading: HeadingProps
    Text: TextProps;
    Hero: HeroProps;
};

export const config: Config<Props> = {
    components: {
        Heading: headingConfig,
        Text: textConfig,
        Hero: heroConfig,
    },
};

export default config;
