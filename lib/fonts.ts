import localFont from "next/font/local";

export const rockingsodaPlus = localFont({
  src: "./assets/RockingsodaPlus-Regular.otf",
  variable: "--rockingsoda",
  display: "swap",
});

export const poppins = localFont({
  src: [
    {
      path: "./assets/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./assets/Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--poppins",
  display: "swap",
});
