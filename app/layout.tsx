import { poppins, rockingsodaPlus } from "@lib/fonts";
import clsx from "clsx";
import "./styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={clsx(rockingsodaPlus.variable, poppins.variable)}>
        {children}
      </body>
    </html>
  );
}
