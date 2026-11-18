import type { Metadata, Viewport } from "next";
// Fonts are bundled with the app (no request to an outside font service).
// Both cover the extra Kazakh letters: ә, ғ, қ, ң, ө, ұ, ү, һ, і.
import "@fontsource-variable/onest";
import "@fontsource-variable/unbounded";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tańba AI — product labels in Kazakh and Russian",
  description:
    "Translate Korean cosmetics and other product labels into Kazakh and Russian. Upload a photo, review the wording and export your label.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
