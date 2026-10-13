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

// was locked to minimumScale/maximumScale: 1, userScalable: false — that
// blocked pinch-zoom entirely, which fails WCAG 1.4.4 (content must
// support zooming to 200%+) and is a real accessibility regression,
// however useful it was as a workaround. It existed because pinching
// OUT used to shrink the page and expose the browser's own white
// background around it (reading like a horizontal-overflow bug) — that
// was a real symptom at the time, but it traced back to specific
// 100vw-based elements and the lack of a page-wide touch-action rule,
// both fixed independently since. Re-test pinch-zoom-out on the Home
// page after this ships — if the white-margin symptom is back, the fix
// belongs on whichever element is overflowing again, not back on this
// viewport lock.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
