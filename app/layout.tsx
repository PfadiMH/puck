import { poppins, rockingsodaPlus } from "@lib/fonts/fonts";
import clsx from "clsx";
import { Providers } from "../components/Providers";
import "./globals.css";

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
          "font-poppins bg-ground mud-theme"
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
