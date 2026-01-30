import { ComponentConfig, WithPuckProps } from "@measured/puck";

export type CardVariant = "elevated" | "outlined" | "filled";
export type CardSpacing = "none" | "small" | "medium" | "large";

export type CardProps = {
  variant: CardVariant;
  padding: CardSpacing;
  borderRadius: CardSpacing;
  shadow: CardSpacing;
  showHeader: boolean;
  showFooter: boolean;
};

const paddingValues: Record<CardSpacing, string> = {
  none: "0",
  small: "0.5rem",
  medium: "1rem",
  large: "2rem",
};

const borderRadiusValues: Record<CardSpacing, string> = {
  none: "0",
  small: "0.25rem",
  medium: "0.5rem",
  large: "1rem",
};

const shadowValues: Record<CardSpacing, string> = {
  none: "none",
  small: "0 4px 12px rgba(0,0,0,0.4)",
  medium: "0 8px 24px rgba(0,0,0,0.5)",
  large: "0 16px 48px rgba(0,0,0,0.6)",
};

const marginValues: Record<CardSpacing, string> = {
  none: "0",
  small: "0.5rem",
  medium: "1rem",
  large: "1.5rem",
};

const variantClasses: Record<CardVariant, string> = {
  elevated: "bg-elevated",
  outlined: "border border-contrast-ground bg-transparent",
  filled: "bg-primary text-contrast-primary",
};

function Card({
  variant,
  padding,
  borderRadius,
  shadow,
  showHeader,
  showFooter,
  puck: { renderDropZone: DropZone },
}: WithPuckProps<CardProps>) {
  return (
    <div
      className={variantClasses[variant] ?? variantClasses.elevated}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: paddingValues[padding] ?? paddingValues.medium,
        borderRadius: borderRadiusValues[borderRadius] ?? borderRadiusValues.small,
        boxShadow: shadowValues[shadow] ?? shadowValues.none,
        margin: marginValues[shadow] ?? marginValues.none,
      }}
    >
      {showHeader && (
        <div style={{ flexShrink: 0 }}>
          <DropZone zone="header" />
        </div>
      )}
      <div style={{ flexGrow: 1 }}>
        <DropZone zone="body" />
      </div>
      {showFooter && (
        <div style={{ flexShrink: 0 }}>
          <DropZone zone="footer" />
        </div>
      )}
    </div>
  );
}

export const cardConfig: ComponentConfig<CardProps> = {
  label: "Card",
  render: Card,
  defaultProps: {
    variant: "elevated",
    padding: "medium",
    borderRadius: "small",
    shadow: "none",
    showHeader: true,
    showFooter: true,
  },
  fields: {
    variant: {
      type: "select",
      label: "Variant",
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
    borderRadius: {
      type: "select",
      label: "Border Radius",
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
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
      ],
    },
    showHeader: {
      type: "radio",
      label: "Show Header",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    showFooter: {
      type: "radio",
      label: "Show Footer",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
  },
};
