import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Montserrat, Prata } from "next/font/google";
import ScrollToTop from "@/components/ScrollToTop";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const prata = Prata({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-prata",
});

export const metadata: Metadata = {
  title: "SowTrap™ | ScienceOnWheels",
  description: "Elevating nutrition through intelligent delivery science.",
};

// caps pinch-zoom at 1x — without this, Next.js's default viewport
// leaves zoom fully open, and a two-finger (or occasionally a fast
// single-finger) gesture reading as "zoom out" shows the browser's own
// background as a white margin around the shrunk page, which looks
// identical to a horizontal-overflow bug but isn't fixable with any
// amount of overflow-x tightening.
// maximumScale alone only caps zooming IN past 1x — the browser's
// default minimum (as low as 0.25x on some mobile browsers) was still
// wide open, so pinching OUT still shrank the page and exposed that
// same white margin. minimumScale (and userScalable:false as a second
// belt-and-braces layer for older/inconsistent browsers) closes that
// off in both directions.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${montserrat.variable} ${prata.variable}`}
    >
      <body>
        <ScrollToTop />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
