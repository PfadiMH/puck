import { uploadFileField } from "@components/puck-fields/upload-file";
import cn from "@lib/cn";
import { ComponentConfig } from "@measured/puck";
import Image from "next/image";
import Link from "next/link";
import styles from "@components/ui/Button.module.css";

type ButtonItem = {
  content: string;
  url?: string;
  size: "small" | "medium" | "large";
  color: "primary" | "secondary";
  spacing: "none" | "small" | "medium" | "large";
  icon?: string;
  iconPosition: "left" | "right";
};

export type ButtonGroupProps = {
  alignment: "left" | "center" | "right";
  buttons: ButtonItem[];
};

const sizeClasses = {
  small: "text-sm px-5 py-1 font-medium",
  medium: "text-base px-5 py-2 font-semibold",
  large: "text-lg px-7 py-3 font-bold",
};

const iconSizeClasses = {
  small: "w-4 h-4",
  medium: "w-5 h-5",
  large: "w-6 h-6",
};

const spacingClasses = {
  none: "mr-0",
  small: "mr-2",
  medium: "mr-4",
  large: "mr-8",
};

const alignmentClasses = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

function ButtonGroup({ alignment, buttons }: ButtonGroupProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-y-2", alignmentClasses[alignment])}>
      {buttons.map((button, idx) => {
        const isLast = idx === buttons.length - 1;
        const buttonContent = (
          <>
            {button.icon && button.iconPosition === "left" && (
              <span className={cn("relative shrink-0", iconSizeClasses[button.size])}>
                <Image
                  src={button.icon}
                  alt=""
                  fill
                  className="object-contain"
                />
              </span>
            )}
            <span>{button.content}</span>
            {button.icon && button.iconPosition === "right" && (
              <span className={cn("relative shrink-0", iconSizeClasses[button.size])}>
                <Image
                  src={button.icon}
                  alt=""
                  fill
                  className="object-contain"
                />
              </span>
            )}
          </>
        );

        const buttonClasses = cn(
          "cursor-pointer inline-flex items-center gap-2",
          {
            "bg-primary text-contrast-primary hover:bg-primary/90 active:bg-primary/80":
              button.color === "primary",
            "bg-secondary text-contrast-secondary hover:bg-secondary/90 active:bg-secondary/80":
              button.color === "secondary",
          },
          sizeClasses[button.size],
          !isLast && spacingClasses[button.spacing],
          styles.clip
        );

        if (button.url) {
          return (
            <Link key={idx} href={button.url} className={buttonClasses}>
              {buttonContent}
            </Link>
          );
        }

        return (
          <button key={idx} type="button" className={buttonClasses}>
            {buttonContent}
          </button>
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
        size: {
          type: "radio",
          label: "Size",
          options: [
            { label: "S", value: "small" },
            { label: "M", value: "medium" },
            { label: "L", value: "large" },
          ],
        },
        color: {
          type: "radio",
          label: "Color",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
          ],
        },
        spacing: {
          type: "radio",
          label: "Spacing (to next button)",
          options: [
            { label: "None", value: "none" },
            { label: "S", value: "small" },
            { label: "M", value: "medium" },
            { label: "L", value: "large" },
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
        size: "medium",
        color: "primary",
        spacing: "medium",
        iconPosition: "left",
      },
    },
  },
  defaultProps: {
    alignment: "left",
    buttons: [
      {
        content: "Button",
        size: "medium",
        color: "primary",
        spacing: "medium",
        iconPosition: "left",
      },
    ],
  },
};
