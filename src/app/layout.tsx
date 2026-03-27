import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bizcfo.in'),
  title: "BizCFO - Complete Accounting & Finance Platform",
  description: "Your Virtual CFO & Accounting Team. Complete financial services including bookkeeping, GST compliance, virtual CFO services, and billing solutions for small businesses and startups.",
  keywords: ["BizCFO", "accounting", "bookkeeping", "GST compliance", "virtual CFO", "financial services", "business finance", "tax compliance", "invoicing", "outsourced accounting"],
  authors: [{ name: "BizCFO Team" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16.png",
    apple: "/favicon-32.png",
  },
  openGraph: {
    title: "BizCFO - Complete Accounting & Finance Platform",
    description: "Your Virtual CFO & Accounting Team. Transform your business finance with expert accounting services.",
    url: "https://bizcfo.in",
    siteName: "BizCFO",
    type: "website",
    images: [
      {
        url: "/hero-image.png",
        width: 1440,
        height: 720,
        alt: "BizCFO - Financial Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BizCFO - Complete Accounting & Finance Platform",
    description: "Your Virtual CFO & Accounting Team. Transform your business finance with expert accounting services.",
    images: ["/hero-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
