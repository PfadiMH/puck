import clsx from "clsx";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import styles from "./Button.module.css";

function Button({
  children,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      {...props}
      className={clsx(
        "bg-primary text-background hover:bg-primary/90 active:bg-primary/80 px-5 py-2 font-semibold cursor-pointer",
        styles.clip,
        props.className
      )}
    >
      {children}
    </button>
  );
}

export default Button;
