import { Toggle } from "@components/misc/shadcn/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/misc/shadcn/tooltip";
import { cn } from "@lib/utils";
import type { TooltipContentProps } from "@radix-ui/react-tooltip";
import * as React from "react";

interface ToolbarButtonProps extends React.ComponentProps<typeof Toggle> {
  isActive?: boolean;
  tooltip?: string;
  tooltipOptions?: TooltipContentProps;
}

export const ToolbarButton = ({
  isActive,
  children,
  tooltip,
  className,
  tooltipOptions,
  ...props
}: ToolbarButtonProps) => {
  const toggleButton = (
    <Toggle className={cn({ "bg-accent": isActive }, className)} {...props}>
      {children}
    </Toggle>
  );

  if (!tooltip) {
    return toggleButton;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{toggleButton}</TooltipTrigger>
      <TooltipContent {...tooltipOptions}>
        <div className="flex flex-col items-center text-center">{tooltip}</div>
      </TooltipContent>
    </Tooltip>
  );
};

ToolbarButton.displayName = "ToolbarButton";

export default ToolbarButton;
