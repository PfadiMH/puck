import { flexConfig, FlexProps } from "@components/Flex";
import { formGroupConfig, FormGroupProps } from "@components/FormGroup";
import { heroConfig, HeroProps } from "@components/Hero";
import { textConfig, TextProps } from "@components/Text";
import {
  verticalSpaceConfig,
  VerticalSpaceProps,
} from "@components/VerticalSpace";
import type { Config } from "@measured/puck";

type Props = {
  FormGroup: FormGroupProps;
  Text: TextProps;
  Hero: HeroProps;
  VerticalSpace: VerticalSpaceProps;
  Flex: FlexProps;
};

export const config: Config<Props> = {
  components: {
    FormGroup: formGroupConfig,
    Text: textConfig,
    Hero: heroConfig,
    VerticalSpace: verticalSpaceConfig,
    Flex: flexConfig,
  },
};

export default config;
