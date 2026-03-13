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
  label: "Calendar Subscribe",
  render: CalendarSubscribe,
  defaultProps: {
    size: "mittel",
  },
  fields: {
    size: {
      type: "select",
      label: "Card Size",
      options: [
        { label: "Large", value: "gross" },
        { label: "Medium", value: "mittel" },
        { label: "Small", value: "klein" },
      ],
    },
  },
};
