import { CustomField } from "@measured/puck";

export type CustomFieldRenderProps<Props extends any = {}> = {
  field: CustomField<Props>;
  name: string;
  id: string;
  value: Props;
  onChange: (value: Props) => void;
  readOnly?: boolean;
};
