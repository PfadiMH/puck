import clsx from "clsx";
import { InputHTMLAttributes } from "react";

type InputProps = {
  size?: "small" | "medium" | "large";
  type?: "text" | "email" | "password" | "number";
};

function Input({
  size = "medium",
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, keyof InputProps> & InputProps) {
  return (
    <input
      {...props}
      className={clsx(
        "bg-mud-secondary text-mud-contrast-secondary",
        "border-2 border-primary rounded",
        "focus:outline-none focus:ring-2 focus:ring-primary/60",
        "disabled:cursor-not-allowed disabled:bg-primary/70 disabled:text-primary/70",
        "placeholder:opacity-70",
        {
          "text-sm px-2 py-1": size === "small",
          "text-base px-3 py-2": size === "medium",
          "text-lg px-4 py-3": size === "large",
        },
        props.className
      )}
    />
  );
}

export default Input;
