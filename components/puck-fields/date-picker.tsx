"use client";

import DatePicker, { isSaturday } from "@components/ui/DatePicker";
import { CustomFieldRenderProps } from "@lib/custom-field-types";
import { CustomField } from "@puckeditor/core";

type DatePickerProps = string;

/**
 * SaturdayDatePicker - A date picker field for Puck that highlights Saturdays.
 * Built on the base DatePicker component from components/ui/.
 * Shows a visual indicator when a Saturday is selected (typical scout activity day).
 */
function SaturdayDatePicker({
  id,
  onChange,
  value,
  readOnly,
}: CustomFieldRenderProps<DatePickerProps>) {
  const showSaturdayIndicator = value ? isSaturday(value) : false;

  return (
    <div className="flex flex-col gap-2" id={id}>
      <DatePicker
        value={value}
        onChange={onChange}
        disabled={readOnly}
        yearRange={{ before: 0, after: 2 }}
      />
      {showSaturdayIndicator && (
        <div className="flex items-center gap-1.5 text-xs text-yellow-600 font-medium">
          <span className="w-2 h-2 bg-yellow-400 rounded-full" />
          Samstag (üblicher Aktivitätstag)
        </div>
      )}
    </div>
  );
}

export const datePickerField: CustomField<DatePickerProps> = {
  type: "custom",
  label: "Datum",
  render: SaturdayDatePicker,
};
