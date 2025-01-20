import clsx from "clsx";
import { poppins, rockingsodaPlus } from "@lib/fonts";
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
