import clsx from "clsx";
import { HTMLAttributes } from "react";

type CardProps = {
  size?: "small" | "medium" | "large";
  type?: "text" | "email" | "password" | "number";
};

function Card({
  size = "medium",
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, keyof CardProps> & CardProps) {
  return (
    <div
      {...props}
      className={clsx("bg-accent rounded-xl p-4", props.className)}
    />
  );
}

export default Card;
