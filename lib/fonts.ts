import { Poppins } from "next/font/google";
import localFont from "next/font/local";

export const rockingsodaPlus = localFont({
  src: "./RockingsodaPlus-Regular.otf",
  variable: "--rockingsoda",
  display: "swap",
});

export const poppins = Poppins({
  weight: ["400", "700"],
  variable: "--poppins",
  display: "swap",
  subsets: ["latin"],
});
