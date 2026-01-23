"use client";

import { CustomFieldRenderProps } from "@lib/custom-field-types";
import { CustomField } from "@measured/puck";

type TimePickerProps = string;

const hours = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0")
);
const minutes = ["00", "15", "30", "45"];

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

  const selectStyles =
    "px-3 py-2 border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer";

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
      <span className="text-gray-500 font-medium">:</span>
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
      <span className="text-gray-500 text-sm">Uhr</span>
    </div>
  );
}

export const timePickerField: CustomField<TimePickerProps> = {
  type: "custom",
  label: "Zeit",
  render: TimePicker,
};
