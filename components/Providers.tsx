"use client";

import { queryClient } from "@lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import { CartDrawer } from "./shop/CartDrawer";
import { CartProvider } from "./shop/CartProvider";
import Toaster from "./ui/Toast";

export function Providers({
  children,
  session,
}: PropsWithChildren<{ session: Session | null }>) {
  return (
    <SessionProvider basePath="/auth" session={session}>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <ParallaxProvider>{children}</ParallaxProvider>
          <CartDrawer />
          <Toaster />
        </CartProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
