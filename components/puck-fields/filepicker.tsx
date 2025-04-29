import { CustomFieldRenderProps } from "@lib/custom-field-types";
import { AutoField } from "@measured/puck";

type FilepickerProps = string | undefined;

export function Filepicker({
  value,
  onChange,
}: CustomFieldRenderProps<FilepickerProps>) {
  return (
    <AutoField
      field={{ type: "custom" }}
      onChange={(value) => onChange(value as FilepickerProps)}
      value={value}
    />
  );
}
