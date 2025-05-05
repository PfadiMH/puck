import type { Config } from "@measured/puck";
import { textConfig, TextProps } from "@components/Text";
import { formGroupConfig, FormGroupProps } from "@components/FormGroup";
import { heroConfig, HeroProps } from "@components/Hero";
import {
  verticalSpaceConfig,
  VerticalSpaceProps,
} from "@components/VerticalSpace";
import { flexConfig, FlexProps } from "@components/Flex";

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
