"use client";

import { queryClient } from "@lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { ParallaxProvider } from "react-scroll-parallax";

export function Providers({ children }: PropsWithChildren<unknown>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ParallaxProvider>{children}</ParallaxProvider>
    </QueryClientProvider>
  );
}
