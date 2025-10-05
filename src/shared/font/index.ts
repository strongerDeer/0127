import localFont from "next/font/local";
import { Outfit } from "next/font/google";

export const pretendard = localFont({
  src: "./PretendardVariable.woff2",
  display: "swap",
  preload: true,
  weight: "100 900",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "system-ui",
    "Roboto",
    "Helvetica Neue",
    "Segoe UI",
    "Arial",
    "sans-serif",
  ],
  adjustFontFallback: "Arial",
  variable: "--font-pretendard",
});

export const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
  preload: true,
});
