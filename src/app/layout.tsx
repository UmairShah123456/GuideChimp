import type { Metadata } from "next";
import { appFont } from "@/lib/branding/fonts";
import "./globals.css";

const description =
  "One home for every guide your short-let business runs on — company processes, cleaner turnarounds, staff training and the guest check-in experience. Share a link per audience; no app, no accounts.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "GuideChimp — every guide your rental business runs on, in one place",
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
    <html lang="en" className={appFont.variable}>
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
