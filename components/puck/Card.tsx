import { ComponentConfig, WithPuckProps } from "@puckeditor/core";

export type CardVariant = "elevated" | "outlined" | "filled";
export type CardSpacing = "none" | "small" | "medium" | "large";

export type CardProps = {
  variant: CardVariant;
  padding: CardSpacing;
  shadow: CardSpacing;
};

const BORDER_RADIUS = "0.625rem";

const paddingValues: Record<CardSpacing, string> = {
  none: "0",
  small: "0.75rem",
  medium: "1.25rem",
  large: "2rem",
};

const shadowValues: Record<CardSpacing, string> = {
  none: "none",
  small: "0 2px 4px rgba(0,0,0,0.08)",
  medium: "0 4px 6px rgba(0,0,0,0.1)",
  large: "0 8px 16px rgba(0,0,0,0.12)",
};

const variantClasses: Record<CardVariant, string> = {
  elevated: "bg-elevated",
  outlined: "border border-contrast-ground bg-transparent",
  filled: "bg-primary text-contrast-primary",
};

function Card({
  variant,
  padding,
  shadow,
  puck: { renderDropZone: DropZone },
}: WithPuckProps<CardProps>) {
  return (
    <div
      className={variantClasses[variant] ?? variantClasses.elevated}
      style={{
        padding: paddingValues[padding] ?? paddingValues.medium,
        borderRadius: BORDER_RADIUS,
        boxShadow: shadowValues[shadow] ?? shadowValues.none,
      }}
    >
      <DropZone zone="content" />
    </div>
  );
}

export const cardConfig: ComponentConfig<CardProps> = {
  label: "Card",
  render: Card,
  defaultProps: {
    variant: "elevated",
    padding: "medium",
    shadow: "medium",
  },
  fields: {
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
