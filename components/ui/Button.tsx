import clsx from "clsx";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import styles from "./Button.module.css";

type ButtonProps = {
  size?: "small" | "medium" | "large";
};

function Button({
  children,
  size = "medium",
  ...props
}: Omit<
  PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>,
  keyof ButtonProps
> &
  ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "bg-primary text-background hover:bg-primary/90 active:bg-primary/80 font-semibold cursor-pointer",
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
