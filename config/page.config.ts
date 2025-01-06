import type { Config } from "@measured/puck";
import type { TextProps } from "@components/Text";
import { textConfig } from "@components/Text";
import { ImageComponentProps, imageConfig } from "@components/Image";

type Props = {
    Text: TextProps;
    Image: ImageComponentProps
};

export const config: Config<Props> = {
    components: {
        Text: textConfig,
        Image: imageConfig,
    },
};

export default config;
