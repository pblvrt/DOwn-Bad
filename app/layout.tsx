import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spinmoji",
  description: "A roguelike deckbuilding slot machine game",
  manifest: "/manifest.json",
  themeColor: "#6a3cb5",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Spinmoji",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://spinmoji.gg/",
    title: "Spinmoji",
    description: "A roguelike deckbuilding slot machine game",
    siteName: "Spinmoji",
    images: [
      {
        url: "/sso-image.png",
        width: 1200,
        height: 630,
        alt: "Spinmoji - A roguelike deckbuilding slot machine game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spinmoji",
    description: "A roguelike deckbuilding slot machine game",
    images: ["/sso-image.png"],
    creator: "@spinmoji",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/192x192.png" }],
  },
  applicationName: "Spinmoji",
  keywords: [
    "slot machine",
    "roguelike",
    "deckbuilding",
    "game",
    "emoji",
    "spinmoji",
  ],
  authors: [{ name: "Spinmoji Team" }],
  category: "Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Analytics />
        <title>Spinmoji</title>
        <meta
          name="description"
          content="A roguelike deckbuilding slot machine game"
        />

        <meta property="og:url" content="https://spinmoji.gg" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Spinmoji" />
        <meta
          property="og:description"
          content="A roguelike deckbuilding slot machine game"
        />
        <meta
          property="og:image"
          content="https://opengraph.b-cdn.net/production/images/5908da24-1b14-45a2-9356-42152851a646.png?token=J98zRm7OT0_6zzgYJHi2GmVSnnW9Mx-cNT-iLzmqu_E&height=630&width=1200&expires=33278401097"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="spinmoji.gg" />
        <meta property="twitter:url" content="https://spinmoji.gg" />
        <meta name="twitter:title" content="Spinmoji" />
        <meta
          name="twitter:description"
          content="A roguelike deckbuilding slot machine game"
        />
        <meta
          name="twitter:image"
          content="https://opengraph.b-cdn.net/production/images/5908da24-1b14-45a2-9356-42152851a646.png?token=J98zRm7OT0_6zzgYJHi2GmVSnnW9Mx-cNT-iLzmqu_E&height=630&width=1200&expires=33278401097"
        />

        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-2048-2732.png"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1668-2388.png"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1536-2048.png"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1125-2436.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-750-1334.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-640-1136.png"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
