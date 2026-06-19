import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NEXUS — Crie. Conecte. Monetize.",
    template: "%s — NEXUS",
  },
  description:
    "A plataforma tudo-em-um para criadores de conteúdo, comunidades e monetização.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#9165ff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans ambient-bg min-h-dvh`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
