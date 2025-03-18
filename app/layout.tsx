import { poppins, rockingsodaPlus } from "@lib/fonts/fonts";
import clsx from "clsx";
import "./globals.css";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={clsx(
          rockingsodaPlus.variable,
          poppins.variable,
          "font-poppins bg-background mud-theme"
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
