import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

const description =
  "GuideChimp turns check-in steps, Wi-Fi, parking, appliance how-tos and your local picks into one branded guide. Share a single link — no app for guests.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "GuideChimp — digital guidebooks that answer guests' questions",
    template: "%s · GuideChimp",
  },
  description,
  applicationName: "GuideChimp",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  openGraph: {
    title: "GuideChimp",
    description,
    siteName: "GuideChimp",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "GuideChimp",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        {/*
          Marks JS as available before first paint. The scroll-reveal styles are
          scoped to `.js`, so without this the page still renders fully visible
          rather than waiting on hydration to un-hide itself.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
