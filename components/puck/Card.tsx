import cn from "@lib/cn";
import { ComponentConfig, Slot } from "@puckeditor/core";

export type CardVariant = "elevated" | "outlined" | "filled";
export type CardSpacing = "none" | "small" | "medium" | "large";

export type CardProps = {
  content: Slot;
  variant: CardVariant;
  padding: CardSpacing;
  /** @deprecated Shadow has been removed. Kept for backward compatibility with saved data. */
  shadow?: CardSpacing;
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

export const cardConfig: ComponentConfig<CardProps> = {
  label: "Card",
  render: ({ content: Content, variant, padding }) => (
    <div
      className={cn(
        "min-w-0 overflow-hidden rounded-[0.625rem]",
        variantClasses[variant] ?? variantClasses.elevated,
        paddingClasses[padding] ?? paddingClasses.medium,
      )}
    >
      <Content />
    </div>
  ),
  defaultProps: {
    content: [],
    variant: "elevated",
    padding: "medium",
    shadow: "none",
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
  },
};
