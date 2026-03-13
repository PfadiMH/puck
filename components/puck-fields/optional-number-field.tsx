import cn from "@lib/cn";
import { CustomFieldRenderProps } from "@lib/custom-field-types";
import { CustomField } from "@puckeditor/core";

type OptionalNumberProps = number | undefined;

interface OptionalNumberFieldOptions {
  label: string;
  min?: number;
  max?: number;
  description?: string;
}

function OptionalNumberInput({
  id,
  onChange,
  value,
  readOnly,
  field,
}: CustomFieldRenderProps<OptionalNumberProps> & {
  field: CustomField<OptionalNumberProps> & { min?: number; max?: number; description?: string };
}) {
  const inputStyles = cn(
    "w-full px-[15px] py-[12px] rounded-[4px] box-border",
    "bg-[var(--puck-color-white)] border border-[var(--puck-color-grey-09)]",
    "text-[14px] font-[inherit]",
    "transition-[border-color] duration-[50ms] ease-in",
    "disabled:cursor-not-allowed disabled:opacity-50",
  );

  return (
    <div className="flex flex-col gap-1" id={id}>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value ?? ""}
          min={field.min}
          max={field.max}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === "" ? undefined : Number(val));
          }}
          className={inputStyles}
          disabled={readOnly}
        />
        {value !== undefined && value !== null && !readOnly && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-gray-400 hover:text-gray-600 px-1"
          >
            ✕
          </button>
        )}
      </div>
      {field.description && (
        <p className="text-xs text-gray-500">{field.description}</p>
      )}
    </div>
  );
}

export function optionalNumberField(
  options: OptionalNumberFieldOptions,
): CustomField<OptionalNumberProps> {
  return {
    type: "custom",
    label: options.label,
    min: options.min,
    max: options.max,
    description: options.description,
    render: OptionalNumberInput,
  } as CustomField<OptionalNumberProps> & { min?: number; max?: number; description?: string };
}
