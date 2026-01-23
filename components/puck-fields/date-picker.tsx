"use client";

import { CustomFieldRenderProps } from "@lib/custom-field-types";
import { CustomField } from "@measured/puck";

type DatePickerProps = string;

const months = [
  { value: "01", label: "Januar" },
  { value: "02", label: "Februar" },
  { value: "03", label: "März" },
  { value: "04", label: "April" },
  { value: "05", label: "Mai" },
  { value: "06", label: "Juni" },
  { value: "07", label: "Juli" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Dezember" },
];

// Generate years from current year to +2 years
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 3 }, (_, i) => (currentYear + i).toString());

function getDaysInMonth(month: string, year: string): string[] {
  const daysCount = new Date(parseInt(year), parseInt(month), 0).getDate();
  return Array.from({ length: daysCount }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
}

function DatePicker({
  id,
  onChange,
  value,
  readOnly,
}: CustomFieldRenderProps<DatePickerProps>) {
  // Parse value (YYYY-MM-DD) or use defaults
  const today = new Date();
  const [year, month, day] = value
    ? value.split("-")
    : [
        today.getFullYear().toString(),
        (today.getMonth() + 1).toString().padStart(2, "0"),
        today.getDate().toString().padStart(2, "0"),
      ];

  const days = getDaysInMonth(month, year);

  // Check if selected date is a Saturday (parse without timezone shift)
  const isSaturday = value
    ? new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getDay() === 6
    : false;

  const handleChange = (newDay: string, newMonth: string, newYear: string) => {
    // Validate day for new month/year
    const maxDays = getDaysInMonth(newMonth, newYear).length;
    const validDay = Math.min(parseInt(newDay), maxDays)
      .toString()
      .padStart(2, "0");
    onChange(`${newYear}-${newMonth}-${validDay}`);
  };

  const selectStyles =
    "px-3 py-2 border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer";

  return (
    <div className="flex flex-col gap-2" id={id}>
      <div className="flex items-center gap-2">
        {/* Day */}
        <select
          value={day}
          onChange={(e) => handleChange(e.target.value, month, year)}
          className={selectStyles}
          disabled={readOnly}
        >
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <span className="text-gray-500">.</span>
        {/* Month */}
        <select
          value={month}
          onChange={(e) => handleChange(day, e.target.value, year)}
          className={`${selectStyles} flex-1`}
          disabled={readOnly}
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        {/* Year */}
        <select
          value={year}
          onChange={(e) => handleChange(day, month, e.target.value)}
          className={selectStyles}
          disabled={readOnly}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      {isSaturday && (
        <div className="flex items-center gap-1 text-xs text-yellow-600 font-medium">
          <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
          Samstag (üblicher Aktivitätstag)
        </div>
      )}
    </div>
  );
}

export const datePickerField: CustomField<DatePickerProps> = {
  type: "custom",
  label: "Datum",
  render: DatePicker,
};
