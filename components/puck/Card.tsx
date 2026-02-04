import cn from "@lib/cn";
import { ComponentConfig, Slot } from "@puckeditor/core";

export type CardVariant = "elevated" | "outlined" | "filled";
export type CardSpacing = "none" | "small" | "medium" | "large";

export type CardProps = {
  content: Slot;
  variant: CardVariant;
  padding: CardSpacing;
  shadow: CardSpacing;
};

const variantClasses: Record<CardVariant, string> = {
  elevated: "bg-elevated",
  outlined: "border border-contrast-ground bg-transparent",
  filled: "bg-primary text-contrast-primary",
};

const paddingClasses: Record<CardSpacing, string> = {
  none: "p-0",
  small: "p-3",
  medium: "p-5",
  large: "p-8",
};

const shadowClasses: Record<CardSpacing, string> = {
  none: "",
  small: "shadow-sm",
  medium: "shadow-md",
  large: "shadow-lg",
};

export const cardConfig: ComponentConfig<CardProps> = {
  label: "Card",
  render: ({ content: Content, variant, padding, shadow }) => (
    <div
      className={cn(
        "rounded-xl",
        variantClasses[variant] ?? variantClasses.elevated,
        paddingClasses[padding] ?? paddingClasses.medium,
        shadowClasses[shadow] ?? shadowClasses.none,
      )}
    >
      <Content />
    </div>
  ),
  defaultProps: {
    content: [],
    variant: "elevated",
    padding: "medium",
    shadow: "medium",
  },
  fields: {
    content: {
      type: "slot",
    },
    variant: {
      type: "select",
      label: "Style",
      options: [
        { label: "Elevated", value: "elevated" },
        { label: "Outlined", value: "outlined" },
        { label: "Filled", value: "filled" },
      ],
    },
    padding: {
      type: "select",
      label: "Padding",
      options: [
        { label: "None", value: "none" },
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
      ],
    },
    shadow: {
      type: "select",
      label: "Shadow",
      options: [
        { label: "None", value: "none" },
        { label: "Subtle", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Pronounced", value: "large" },
      ],
    },
  },
};
