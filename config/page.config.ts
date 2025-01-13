import type { Config } from "@measured/puck";
import { textConfig } from "@components/Text";
import type { TextProps } from "@components/Text";
import { heroConfig, HeroProps } from "@components/Hero";
import {
  verticalSpaceConfig,
  VerticalSpaceProps,
} from "@components/VerticalSpace";
import { formGroupConfig, FormGroupProps } from "@components/FormGroup";

type Props = {
  FormGroup: FormGroupProps;
  Hero: HeroProps;
  Text: TextProps;
  VerticalSpace: VerticalSpaceProps;
};

export const config: Config<Props> = {
  components: {
    FormGroup: formGroupConfig,
    Hero: heroConfig,
    Text: textConfig,
    VerticalSpace: verticalSpaceConfig,
  },
};

export default config;
