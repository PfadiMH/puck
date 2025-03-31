"use client";

import { PropsWithChildren } from "react";
import { ParallaxProvider } from "react-scroll-parallax";

export function Providers({ children }: PropsWithChildren<unknown>) {
  return <ParallaxProvider>{children}</ParallaxProvider>;
}
