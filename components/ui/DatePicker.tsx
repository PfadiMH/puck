"use client";

import cn from "@lib/cn";

export type DatePickerProps = {
  value?: string; // YYYY-MM-DD format
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  /** Years to show: [currentYear - yearsBefore, currentYear + yearsAfter] */
  yearRange?: { before?: number; after?: number };
};

const MONTHS = [
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

function getDaysInMonth(month: string, year: string): string[] {
  const daysCount = new Date(parseInt(year), parseInt(month), 0).getDate();
  return Array.from({ length: daysCount }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
}

function getYearOptions(before = 0, after = 2): string[] {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - before;
  const endYear = currentYear + after;
  return Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => (startYear + i).toString()
  );
}

function DatePicker({
  value,
  onChange,
  disabled = false,
  className,
  yearRange = { before: 0, after: 2 },
}: DatePickerProps) {
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
  const years = getYearOptions(yearRange.before, yearRange.after);

  const handleChange = (newDay: string, newMonth: string, newYear: string) => {
    // Validate day for new month/year
    const maxDays = getDaysInMonth(newMonth, newYear).length;
    const validDay = Math.min(parseInt(newDay), maxDays)
      .toString()
      .padStart(2, "0");
    onChange?.(`${newYear}-${newMonth}-${validDay}`);
  };

  const selectStyles = cn(
    "px-3 py-2 rounded-md cursor-pointer",
    "bg-elevated border-2 border-primary/30",
    "text-contrast-ground",
    "hover:border-primary/50",
    "focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary",
    "disabled:cursor-not-allowed disabled:opacity-50"
  );

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Day */}
      <select
        value={day}
        onChange={(e) => handleChange(e.target.value, month, year)}
        className={cn(selectStyles, "w-16")}
        disabled={disabled}
      >
        {days.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <span className="text-contrast-ground/50">.</span>

      {/* Month */}
      <select
        value={month}
        onChange={(e) => handleChange(day, e.target.value, year)}
        className={cn(selectStyles, "flex-1 min-w-[120px]")}
        disabled={disabled}
      >
        {MONTHS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>

      {/* Year */}
      <select
        value={year}
        onChange={(e) => handleChange(day, month, e.target.value)}
        className={cn(selectStyles, "w-20")}
        disabled={disabled}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Helper to get the day of week for a date string */
export function getDayOfWeek(dateString: string): number {
  if (!dateString) return -1;
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day).getDay();
}

/** Check if a date string represents a Saturday */
export function isSaturday(dateString: string): boolean {
  return getDayOfWeek(dateString) === 6;
}

export default DatePicker;
