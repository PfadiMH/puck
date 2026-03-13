import { ComponentConfig } from "@puckeditor/core";
import { optionalNumberField } from "@components/puck-fields/optional-number-field";
import React from "react";

export type IFrameProps = {
  source: string;
  height: number | undefined;
  title: string;
};

function IFrame({ source, height, title }: IFrameProps) {
  if (!source) {
    return (
      <div className="border-2 border-dashed border-contrast-ground/30 rounded-lg p-8 text-center text-contrast-ground/50">
        No URL or embed code provided
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <iframe src={source} width="100%" height={height} title={title} />
    </div>
  );
}

export const iframeConfig: ComponentConfig<IFrameProps> = {
  label: "IFrame",
  render: IFrame,
  fields: {
    source: {
      type: "textarea",
      label: "URL or Embed Code",
    },
    height: optionalNumberField({
      label: "Height in pixels (optional)",
      min: 0,
    }),
    title: {
      type: "text",
      label: "Title (for accessibility)",
    },
  },
  defaultProps: {
    source: "",
    height: undefined,
    title: "",
  },
};
