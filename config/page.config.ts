import { flexConfig, FlexProps } from "@components/puck/Flex";
import { formGroupConfig, FormGroupProps } from "@components/puck/FormGroup";
import { heroConfig, HeroProps } from "@components/puck/Hero";
import { textConfig, TextProps } from "@components/puck/Text";
import {
  verticalSpaceConfig,
  VerticalSpaceProps,
} from "@components/puck/VerticalSpace";
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
