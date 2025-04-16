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
        "bg-primary text-background",
        "border-2 border-primary rounded",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        "disabled:cursor-not-allowed disabled:bg-primary/70 disabled:text-background/70",
        "placeholder:opacity-70",
        {
          "text-sm px-2 py-1 font-medium": size === "small",
          "text-base px-3 py-2 font-semibold": size === "medium",
          "text-lg px-4 py-3 font-bold": size === "large",
        },
        props.className
      )}
    />
  );
}

export default Input;
