import cn from "@lib/cn";
import { PropsWithChildren } from "react";

type CardProps = {
  className?: string;
};

function Card({ children, className }: PropsWithChildren<CardProps>) {
  return (
    <div className={cn("bg-elevated rounded-xl p-6", className)}>
      {children}
    </div>
  );
}

export default Card;
