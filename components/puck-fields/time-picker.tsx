"use client";

import cn from "@lib/cn";
import { CustomFieldRenderProps } from "@lib/custom-field-types";
import { CustomField } from "@puckeditor/core";

type TimePickerProps = string;

const hours = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
const minutes = ["00", "15", "30", "45"];

/**
 * TimePicker - A time picker field for Puck with hour/minute dropdowns.
 * Uses theme-aware styles matching the DatePicker component.
 */
function TimePicker({
  id,
  onChange,
  value,
  readOnly,
}: CustomFieldRenderProps<TimePickerProps>) {
  const [hour, minute] = (value || "14:00").split(":");

  const handleHourChange = (newHour: string) => {
    onChange(`${newHour}:${minute || "00"}`);
  };

  const handleMinuteChange = (newMinute: string) => {
    onChange(`${hour || "14"}:${newMinute}`);
  };

  const selectStyles = cn(
    "px-3 py-2 rounded-md cursor-pointer",
    "bg-elevated border-2 border-primary/30",
    "text-contrast-ground",
    "hover:border-primary/50",
    "focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary",
    "disabled:cursor-not-allowed disabled:opacity-50",
  );

  return (
    <div className="flex items-center gap-2" id={id}>
      <select
        value={hour || "14"}
        onChange={(e) => handleHourChange(e.target.value)}
        className={selectStyles}
        disabled={readOnly}
      >
        {hours.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className="text-contrast-ground/90 font-medium">:</span>
      <select
        value={minute || "00"}
        onChange={(e) => handleMinuteChange(e.target.value)}
        className={selectStyles}
        disabled={readOnly}
      >
        {minutes.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <span className="text-contrast-ground/90 text-sm">Uhr</span>
    </div>
  );
}

export const timePickerField: CustomField<TimePickerProps> = {
  type: "custom",
  label: "Zeit",
  render: TimePicker,
};
