import Button from "@components/ui/Button";
import { filePickerField } from "@components/puck-fields/file-picker";
import cn from "@lib/cn";
import { ComponentConfig } from "@puckeditor/core";
import Image from "next/image";
import Link from "next/link";

type ButtonItem = {
  content: string;
  url?: string;
  color: "primary" | "secondary";
  icon?: string;
};

export type ButtonGroupProps = {
  alignment: "left" | "center" | "right";
  size: "small" | "medium" | "large";
  spacing: "none" | "small" | "medium" | "large";
  icon?: string;
  iconPosition: "left" | "right";
  buttons: ButtonItem[];
};

const iconSizeClasses = {
  small: "w-5 h-5",
  medium: "w-6 h-6",
  large: "w-8 h-8",
};

const iconSizes = {
  small: "20px",
  medium: "24px",
  large: "32px",
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

function ButtonIcon({ icon, size }: { icon: string; size: ButtonGroupProps["size"] }) {
  return (
    <span className={cn("relative shrink-0", iconSizeClasses[size])}>
      <Image src={icon} alt="" fill sizes={iconSizes[size]} className="object-contain" />
    </span>
  );
}

function ButtonContent({
  button,
  globalIcon,
  iconPosition,
  size,
}: {
  button: ButtonItem;
  globalIcon?: string;
  iconPosition: ButtonGroupProps["iconPosition"];
  size: ButtonGroupProps["size"];
}) {
  const icon = button.icon || globalIcon;
  return (
    <>
      {icon && iconPosition === "left" && <ButtonIcon icon={icon} size={size} />}
      <span>{button.content}</span>
      {icon && iconPosition === "right" && <ButtonIcon icon={icon} size={size} />}
    </>
  );
}

function ButtonGroup({ alignment, size, spacing, icon, iconPosition, buttons }: ButtonGroupProps) {
  return (
    <div className={cn("flex flex-wrap items-center", alignmentClasses[alignment], gapClasses[spacing])}>
      {buttons.map((button, idx) => {
        const hasIcon = button.icon || icon;
        return button.url ? (
          <Button
            key={idx}
            asChild
            size={size}
            color={button.color}
            className="gap-2"
          >
            <Link href={button.url} {...(!button.content && hasIcon ? { "aria-label": "Button" } : {})}>
              <ButtonContent button={button} globalIcon={icon} iconPosition={iconPosition} size={size} />
            </Link>
          </Button>
        ) : (
          <Button
            key={idx}
            type="button"
            size={size}
            color={button.color}
            className="gap-2"
            {...(!button.content && hasIcon ? { "aria-label": "Button" } : {})}
          >
            <ButtonContent button={button} globalIcon={icon} iconPosition={iconPosition} size={size} />
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
    icon: {
      ...filePickerField,
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
          ...filePickerField,
          label: "Icon (optional, overrides global)",
        },
      },
      defaultItemProps: {
        content: "Button",
        color: "primary",
      },
    },
  },
  defaultProps: {
    alignment: "left",
    size: "medium",
    spacing: "medium",
    iconPosition: "left",
    buttons: [
      {
        content: "Button",
        color: "primary",
      },
    ],
  },
};
