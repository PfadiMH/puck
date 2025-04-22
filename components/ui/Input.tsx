import cn from "@lib/cn";
import { InputHTMLAttributes } from "react";

type InputProps = {
  size?: "small" | "medium" | "large";
  type?: "text" | "email" | "password" | "number";
  error?: boolean;
  className?: string;
} & Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "placeholder" | "disabled" | "value" | "onChange"
>;

function Input({ size = "medium", error, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
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
        error && "border-red-500 focus:ring-red-500/60",
        className
      )}
      {...props}
    />
  );
}

export default Input;
