import { ComponentConfig } from "@puckeditor/core";

export type VerticalSpaceProps = {
  size: string;
};

function VerticalSpace({ size }: VerticalSpaceProps) {
  return <div style={{ height: size, width: "100%" }} />;
}

const spacingOptions = [
  "8px",
  "16px",
  "24px",
  "32px",
  "40px",
  "48px",
  "56px",
  "64px",
  "72px",
  "80px",
  "88px",
  "96px",
  "104px",
  "112px",
  "120px",
  "128px",
  "136px",
  "144px",
  "152px",
  "160px",
];

export const verticalSpaceConfig: ComponentConfig<VerticalSpaceProps> = {
  label: "Vertical Space",
  fields: {
    size: {
      type: "select",
      options: spacingOptions.map((size) => ({ label: size, value: size })),
    },
  },
  defaultProps: {
    size: "24px",
  },
  render: VerticalSpace,
};
