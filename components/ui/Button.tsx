import cn from "@lib/cn";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import styles from "./Button.module.css";

const buttonVariants = cva(
  cn("cursor-pointer inline-flex items-center justify-center", styles.clip),
  {
    variants: {
      size: {
        small: "text-sm px-5 py-1 font-medium",
        medium: "text-base px-5 py-2 font-semibold",
        large: "text-lg px-7 py-3 font-bold",
      },
      color: {
        primary:
          "bg-primary text-contrast-primary hover:bg-primary/90 active:bg-primary/80 disabled:bg-primary/50",
        secondary:
          "bg-secondary text-contrast-secondary hover:bg-secondary/90 active:bg-secondary/80 disabled:bg-secondary/50",
      },
    },
    defaultVariants: {
      size: "medium",
      color: "secondary",
    },
  }
);

type ButtonProps = VariantProps<typeof buttonVariants> & {
  asChild?: boolean;
};

function Button({
  children,
  size,
  color,
  asChild = false,
  className,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      {...props}
      className={cn(buttonVariants({ size, color }), className)}
    >
      {children}
    </Comp>
  );
}

export { buttonVariants };
export default Button;
