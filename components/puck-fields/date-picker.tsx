"use client";

import DatePicker, {
  formatLocalDate,
  isSaturday,
  parseLocalDate,
} from "@components/ui/DatePicker";
import { CustomFieldRenderProps } from "@lib/custom-field-types";
import { CustomField } from "@puckeditor/core";

type DatePickerFieldProps = string;

/**
 * SaturdayDatePicker - A date picker field for Puck that highlights Saturdays.
 * Built on the shadcn DatePicker component (Popover + Calendar).
 * Shows a visual indicator when a Saturday is selected (typical scout activity day).
 * Saturdays are highlighted in the calendar with a yellow indicator.
 */
function SaturdayDatePicker({
  id,
  onChange,
  value,
  readOnly,
}: CustomFieldRenderProps<DatePickerFieldProps>) {
  // Convert string value (YYYY-MM-DD) to Date for the picker
  const dateValue = value ? parseLocalDate(value) : undefined;
  const showSaturdayIndicator = dateValue ? isSaturday(dateValue) : false;

  // Handle date change - convert Date back to YYYY-MM-DD string for Puck
  const handleChange = (date: Date | undefined) => {
    if (date) {
      onChange(formatLocalDate(date));
    }
  };

  return (
    <div className="flex flex-col gap-2" id={id}>
      <DatePicker
        value={dateValue}
        onChange={handleChange}
        disabled={readOnly}
        calendarProps={{
          // Highlight Saturdays with custom modifier styling
          modifiers: {
            saturday: (date) => date.getDay() === 6,
          },
          modifiersClassNames: {
            saturday:
              "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-yellow-400 after:rounded-full",
          },
        }}
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

export const datePickerField: CustomField<DatePickerFieldProps> = {
  type: "custom",
  label: "Datum",
  render: SaturdayDatePicker,
};
