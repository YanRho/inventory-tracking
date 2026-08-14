import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceWorkerRegistrar } from "@/components/layout/ServiceWorkerRegistrar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chromebook Inventory",
  description: "Scan and track Chromebook inventory during device deployment.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Chromebook Inventory",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#1d4ed8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegistrar />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
