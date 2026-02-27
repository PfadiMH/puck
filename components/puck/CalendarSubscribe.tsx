import { ComponentConfig } from "@puckeditor/core";
import { CalendarSubscribeClient } from "./CalendarSubscribeClient";

export type CalendarSubscribeSize = "gross" | "mittel" | "klein";

export type CalendarSubscribeProps = {
  size: CalendarSubscribeSize;
};

function CalendarSubscribe({ size }: CalendarSubscribeProps) {
  return <CalendarSubscribeClient size={size} />;
}

export const calendarSubscribeConfig: ComponentConfig<CalendarSubscribeProps> = {
  label: "Kalender-Abo",
  render: CalendarSubscribe,
  defaultProps: {
    size: "mittel",
  },
  fields: {
    size: {
      type: "select",
      label: "Kartengrösse",
      options: [
        { label: "Gross", value: "gross" },
        { label: "Mittel", value: "mittel" },
        { label: "Klein", value: "klein" },
      ],
    },
  },
};
