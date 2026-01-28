import Button, { getButtonClasses } from "@components/ui/Button";
import { uploadFileField } from "@components/puck-fields/upload-file";
import cn from "@lib/cn";
import { ComponentConfig } from "@measured/puck";
import Image from "next/image";
import Link from "next/link";

type ButtonItem = {
  content: string;
  url?: string;
  color: "primary" | "secondary";
  icon?: string;
  iconPosition: "left" | "right";
};

export type ButtonGroupProps = {
  alignment: "left" | "center" | "right";
  size: "small" | "medium" | "large";
  spacing: "none" | "small" | "medium" | "large";
  buttons: ButtonItem[];
};

const iconSizeClasses = {
  small: "w-4 h-4",
  medium: "w-5 h-5",
  large: "w-6 h-6",
};

const gapClasses = {
  none: "gap-0",
  small: "gap-2",
  medium: "gap-4",
  large: "gap-8",
};

const alignmentClasses = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

function ButtonGroup({ alignment, size, spacing, buttons }: ButtonGroupProps) {
  const renderIcon = (icon: string) => (
    <span className={cn("relative shrink-0", iconSizeClasses[size])}>
      <Image src={icon} alt="" fill className="object-contain" />
    </span>
  );

  const renderButtonContent = (button: ButtonItem) => (
    <>
      {button.icon && button.iconPosition === "left" && renderIcon(button.icon)}
      <span>{button.content}</span>
      {button.icon && button.iconPosition === "right" && renderIcon(button.icon)}
    </>
  );

  return (
    <div className={cn("flex flex-wrap items-center", alignmentClasses[alignment], gapClasses[spacing])}>
      {buttons.map((button, idx) => {
        const buttonClasses = getButtonClasses(size, button.color, "inline-flex items-center gap-2");

        if (button.url) {
          return (
            <Link key={idx} href={button.url} className={buttonClasses}>
              {renderButtonContent(button)}
            </Link>
          );
        }

        return (
          <Button key={idx} type="button" size={size} color={button.color} className="inline-flex items-center gap-2">
            {renderButtonContent(button)}
          </Button>
        );
      })}
    </div>
  );
}

export const buttonGroupConfig: ComponentConfig<ButtonGroupProps> = {
  render: ButtonGroup,
  fields: {
    alignment: {
      type: "radio",
      label: "Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    size: {
      type: "radio",
      label: "Button Size",
      options: [
        { label: "S", value: "small" },
        { label: "M", value: "medium" },
        { label: "L", value: "large" },
      ],
    },
    spacing: {
      type: "radio",
      label: "Button Spacing",
      options: [
        { label: "None", value: "none" },
        { label: "S", value: "small" },
        { label: "M", value: "medium" },
        { label: "L", value: "large" },
      ],
    },
    buttons: {
      type: "array",
      label: "Buttons",
      getItemSummary: (item) => item.content || "Empty Button",
      arrayFields: {
        content: {
          type: "text",
          label: "Button Text",
        },
        url: {
          type: "text",
          label: "URL (optional)",
        },
        color: {
          type: "radio",
          label: "Color",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
          ],
        },
        icon: {
          ...uploadFileField,
          label: "Icon (optional)",
        },
        iconPosition: {
          type: "radio",
          label: "Icon Position",
          options: [
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },
          ],
        },
      },
      defaultItemProps: {
        content: "Button",
        color: "primary",
        iconPosition: "left",
      },
    },
  },
  defaultProps: {
    alignment: "left",
    size: "medium",
    spacing: "medium",
    buttons: [
      {
        content: "Button",
        color: "primary",
        iconPosition: "left",
      },
    ],
  },
};
