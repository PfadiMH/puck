import { PropsWithChildren } from "react";
import { Providers } from "../components/Providers";

export default function TestWrapper({ children }: PropsWithChildren<unknown>) {
  return <Providers>{children}</Providers>;
}
