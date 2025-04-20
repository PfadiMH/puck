import cn from "@lib/cn";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import styles from "./Button.module.css";

type ButtonProps = {
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary";
};

function Button({
  children,
  size = "medium",
  color = "secondary",
  ...props
}: Omit<
  PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>,
  keyof ButtonProps
> &
  ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "cursor-pointer",
        {
          "bg-primary text-contrast-primary hover:bg-primary/90 active:bg-primary/80":
            color === "primary",
          "bg-secondary text-contrast-secondary hover:bg-secondary/90 active:bg-secondary/80":
            color === "secondary",
        },
        {
          "text-sm px-5 py-1 font-medium": size === "small",
          "text-base px-5 py-2 font-semibold": size === "medium",
          "text-lg px-7 py-3 font-bold": size === "large",
        },
        styles.clip,
        props.className
      )}
    >
      {children}
    </button>
  );
}

export default Button;
