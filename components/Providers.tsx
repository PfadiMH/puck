"use client";

import { queryClient } from "@lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import Toaster from "./ui/Toast";

export function Providers({ children }: PropsWithChildren<unknown>) {
  return (
    <SessionProvider basePath="/auth">
      <QueryClientProvider client={queryClient}>
        <ParallaxProvider>{children}</ParallaxProvider>
        <Toaster />
      </QueryClientProvider>
    </SessionProvider>
  );
}
