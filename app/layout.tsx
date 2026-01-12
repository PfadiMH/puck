import { auth } from "@lib/auth/auth-client";
import cn from "@lib/cn";
import { poppins, rockingsodaPlus } from "@lib/fonts";
import { Providers } from "../components/Providers";
import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={cn(
          rockingsodaPlus.variable,
          poppins.variable,
          "font-poppins bg-ground mud-theme"
        )}
      >
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
