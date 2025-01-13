import type { Config } from "@measured/puck";
import { textConfig } from "@components/Text";
import type { TextProps } from "@components/Text";
import { heroConfig } from "@components/Hero";
import type { HeroProps } from "@components/Hero";
import { verticalSpaceConfig } from "@components/VerticalSpace";
import type { VerticalSpaceProps } from "@components/VerticalSpace";
import { iframeConfig } from "@components/IFrame";
import type { IFrameProps } from "@components/IFrame";


type Props = {
    Text: TextProps;
    Hero: HeroProps;
    VerticalSpace: VerticalSpaceProps;
    IFrame: IFrameProps;
};

export const config: Config<Props> = {
    components: {
        Text: textConfig,
        Hero: heroConfig,
        VerticalSpace: verticalSpaceConfig,
        IFrame: iframeConfig
    },
};

export default config;
