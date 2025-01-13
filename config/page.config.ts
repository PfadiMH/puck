import type { Config } from "@measured/puck";
import type { TextProps } from "@components/Text";
import { textConfig } from "@components/Text";
import { heroConfig } from "@components/Hero";
import type { HeroProps } from "@components/Hero";
import { ImageComponentProps, imageConfig } from "@components/Image";

type Props = {
    Text: TextProps;
    Hero: HeroProps;
    Image: ImageComponentProps
};

export const config: Config<Props> = {
    components: {
        Text: textConfig,
        Hero: heroConfig,
        Image: imageConfig,
    },
};

export default config;
