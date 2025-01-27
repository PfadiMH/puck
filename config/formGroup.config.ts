import { formGroupConfig, type FormGroupProps } from "@components/FormGroup";
import { Config } from "@measured/puck";

type Props = {
  FormGroup: FormGroupProps;
};

export const config: Config<Props> = {
  components: {
    FormGroup: formGroupConfig,
  },
};
