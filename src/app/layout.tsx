import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Montserrat } from "next/font/google";
import ScrollToTop from "@/components/ScrollToTop";
import CookieConsent from "@/components/CookieConsent";
import ChatButton from "@/components/ChatButton";
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

// Prata (the site's former serif display font, used in ~190 places
// across globals.css via var(--font-prata)) is no longer loaded here —
// --font-prata itself is redefined in globals.css to point at this same
// Montserrat font instead, so every one of those existing rules picks
// up the new font automatically with zero changes needed at each call
// site, and switches the whole site over in one place.

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
      className={`${inter.variable} ${playfair.variable} ${montserrat.variable}`}
    >
      <body>
        <ScrollToTop />
        {children}
        <ChatButton />
        <CookieConsent />
      </body>
    </html>
  );
}
