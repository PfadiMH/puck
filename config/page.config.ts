import type { Config } from "@measured/puck";
import type { TextProps } from "@components/Text";
import { textConfig } from "@components/Text";
import { formGroupConfig, FormGroupProps } from "@components/FormGroup";

type Props = {
  Text: TextProps;
  FormGroup: FormGroupProps;
};

export const config: Config<Props> = {
  components: {
    Text: textConfig,
    FormGroup: formGroupConfig,
  },
};

export default config;
