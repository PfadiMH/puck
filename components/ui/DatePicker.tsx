"use client";

import cn from "@lib/cn";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Popover } from "radix-ui";
import { Calendar, type CalendarProps } from "./Calendar";

export type DatePickerProps = {
  /** Selected date */
  value?: Date;
  /** Callback when date changes */
  onChange?: (date: Date | undefined) => void;
  /** Disable the date picker */
  disabled?: boolean;
  /** Additional class names for the trigger button */
  className?: string;
  /** Placeholder text when no date is selected */
  placeholder?: string;
  /** Props to pass to the Calendar component */
  calendarProps?: Omit<CalendarProps, "mode" | "selected" | "onSelect">;
};

/**
 * DatePicker component using Popover + Calendar.
 * Based on shadcn/ui DatePicker pattern.
 *
 * @see https://ui.shadcn.com/docs/components/radix/date-picker
 */
function DatePicker({
  value,
  onChange,
  disabled = false,
  className,
  placeholder = "Datum wählen",
  calendarProps,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 px-3 py-2 w-full",
            "rounded-md border-2 border-primary/30",
            "bg-elevated text-contrast-ground text-sm text-left",
            "hover:border-primary/50",
            "focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            !value && "text-gray-500",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="h-4 w-4 text-primary" />
          {value ? (
            format(value, "EEEE, d. MMMM yyyy", { locale: de })
          ) : (
            <span>{placeholder}</span>
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={cn(
            "z-50 w-auto p-0",
            "rounded-md border border-gray-200 bg-white shadow-md",
            "outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2",
            "data-[side=top]:slide-in-from-bottom-2"
          )}
          align="start"
          sideOffset={4}
        >
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            autoFocus
            {...calendarProps}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/**
 * Get the day of week for a date (0 = Sunday, 6 = Saturday).
 */
export function getDayOfWeek(date: Date): number {
  return date.getDay();
}

/**
 * Check if a date is a Saturday.
 */
export function isSaturday(date: Date): boolean {
  return getDayOfWeek(date) === 6;
}

/**
 * Parse a YYYY-MM-DD string to a Date object (local timezone).
 */
export function parseLocalDate(dateString: string): Date | undefined {
  if (!dateString) return undefined;
  const [year, month, day] = dateString.split("-").map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return undefined;
  return new Date(year, month - 1, day);
}

/**
 * Format a Date to YYYY-MM-DD string (local timezone).
 */
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default DatePicker;
