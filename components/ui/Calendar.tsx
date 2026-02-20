"use client";

import cn from "@lib/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import { de } from "react-day-picker/locale";

export type CalendarProps = DayPickerProps;

/**
 * Calendar component built on react-day-picker.
 * Based on shadcn/ui Calendar pattern.
 * Uses German locale by default.
 *
 * @see https://ui.shadcn.com/docs/components/radix/calendar
 * @see https://react-day-picker.js.org
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale = de,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={locale}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        button_previous: cn(
          "absolute left-1 top-0",
          "inline-flex items-center justify-center rounded-md text-sm font-medium",
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          "border border-transparent hover:bg-gray-100",
          "focus:outline-none focus:ring-2 focus:ring-primary/50"
        ),
        button_next: cn(
          "absolute right-1 top-0",
          "inline-flex items-center justify-center rounded-md text-sm font-medium",
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          "border border-transparent hover:bg-gray-100",
          "focus:outline-none focus:ring-2 focus:ring-primary/50"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "text-gray-500 rounded-md w-9 font-normal text-[0.8rem] flex items-center justify-center",
        week: "flex w-full mt-2",
        day: cn(
          "h-9 w-9 text-center text-sm p-0 relative",
          "focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-primary/10",
          "[&:has([aria-selected].day-outside)]:bg-primary/5",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md"
        ),
        day_button: cn(
          "h-9 w-9 p-0 font-normal rounded-md",
          "inline-flex items-center justify-center",
          "hover:bg-gray-100 hover:text-gray-900",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          "aria-selected:opacity-100"
        ),
        range_end: "day-range-end",
        selected: cn(
          "bg-primary text-white",
          "hover:bg-primary hover:text-white",
          "focus:bg-primary focus:text-white"
        ),
        today: "bg-gray-100 text-gray-900",
        outside:
          "day-outside text-gray-400 opacity-50 aria-selected:bg-primary/5 aria-selected:text-gray-400 aria-selected:opacity-30",
        disabled: "text-gray-400 opacity-50",
        range_middle:
          "aria-selected:bg-primary/10 aria-selected:text-gray-900",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
