import cn from "@lib/cn";
import { InputHTMLAttributes, ReactNode } from "react";

type CheckboxProps = {
  label?: ReactNode;
  labelClassName?: string;
  containerClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size">;

function Checkbox({
  label,
  className,
  labelClassName,
  containerClassName,
  disabled,
  checked,
  ...props
}: CheckboxProps) {
  const id = props.id ?? `checkbox-${Math.random().toString(36).substring(7)}`;

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center gap-2.5 rounded bg-primary/20 p-3 data-[disabled=true]:bg-primary/10 cursor-pointer data-[disabled=true]:cursor-not-allowed",
        containerClassName
      )}
      data-disabled={disabled}
    >
      <input
        type="checkbox"
        id={id}
        disabled={disabled}
        checked={checked}
        className={cn(
          "appearance-none w-3.5 h-3.5 border border-primary/60 rounded-sm bg-transparent",
          "checked:bg-primary/60",
          "focus:outline-none focus:ring-1 focus:ring-primary",
          "disabled:cursor-not-allowed disabled:border-primary/30 disabled:checked:bg-primary/30",
          "shrink-0",
          className
        )}
        {...props}
      />
      {label && (
        <span className={cn("break-words select-none", labelClassName)}>
          {label}
        </span>
      )}
    </label>
  );
}

export default Checkbox;
