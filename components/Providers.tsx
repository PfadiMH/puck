"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { PropsWithChildren } from "react";
import { ParallaxProvider } from "react-scroll-parallax";

export function Providers({ children }: PropsWithChildren<unknown>) {
  return (
    <TooltipProvider>
      <ParallaxProvider>{children}</ParallaxProvider>
    </TooltipProvider>
  );
}
