import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import "./globals.css";

import { Footer } from "@/components/Footer";
import Navbar from "@/components/nav/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Portfolio",
    template: "%s | Portfolio",
  },
  description: "My personal portfolio website",
  openGraph: {
    type: "website",
    siteName: "Portfolio",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement => (
  <html lang="en" suppressHydrationWarning>
    <head>
      <Script
        id="theme-init"
        strategy="beforeInteractive"
      >{`(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}})()`}</Script>
    </head>
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Navbar />
      {children}
      <Footer />
      <Analytics />
      <SpeedInsights />
    </body>
  </html>
);

export default RootLayout;
