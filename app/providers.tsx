"use client";

import { ParallaxProvider } from "react-scroll-parallax";

export function Providers({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <ParallaxProvider>{children}</ParallaxProvider>;
}
