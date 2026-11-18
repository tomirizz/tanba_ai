import type { Metadata, Viewport } from "next";
// Fonts are bundled with the app (no request to an outside font service).
// Both cover the extra Kazakh letters: ә, ғ, қ, ң, ө, ұ, ү, һ, і.
import "@fontsource-variable/onest";
import "@fontsource-variable/unbounded";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tańba AI — food label localisation for Kazakhstan",
  description:
    "Upload a photo of a foreign food label. Tańba AI translates it into Kazakh and Russian and checks the required details.",
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
