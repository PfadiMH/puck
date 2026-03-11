import { ComponentConfig } from "@puckeditor/core";
import { optionalNumberField } from "@components/puck-fields/optional-number-field";
import React from "react";

export type IFrameProps = {
  source: string;
  height: number | undefined;
  title: string;
};

function IFrame({ source, height, title }: IFrameProps) {
  return (
    <>
      <div className="w-full overflow-hidden">
        <iframe src={source} width="100%" height={height} title={title} />
      </div>
    </>
  );
}

export const iframeConfig: ComponentConfig<IFrameProps> = {
  render: IFrame,
  fields: {
    source: {
      type: "textarea",
    },
    height: optionalNumberField({ label: "Höhe (px)", min: 0 }),
    title: {
      type: "textarea",
    },
  },
};
