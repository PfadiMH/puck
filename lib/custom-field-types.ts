import { CustomField } from "@puckeditor/core";

export type CustomFieldRenderProps<Props extends any = {}> = {
  field: CustomField<Props>;
  name: string;
  id: string;
  value: Props;
  onChange: (value: Props) => void;
  readOnly?: boolean;
};
