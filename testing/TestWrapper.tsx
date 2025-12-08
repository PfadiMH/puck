import { Providers } from "../components/Providers";

export default function TestWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
