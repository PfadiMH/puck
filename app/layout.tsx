import cn from "@lib/cn";
import { poppins, rockingsodaPlus } from "@lib/fonts";
import { Providers } from "../components/Providers";
import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
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
