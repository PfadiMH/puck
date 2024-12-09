import type { Config } from "@measured/puck";
import type { TextProps } from "@components/Text";
import { textConfig } from "@components/Text";

type Props = {
    Text: TextProps;
};

export const config: Config<Props> = {
    components: {
        Text: textConfig,
    },
};

export default config;
