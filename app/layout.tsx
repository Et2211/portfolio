import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";

import { Footer } from "@/components/Footer";
import Navbar from "@/components/nav/Navbar";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";

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

const THEME_INIT_SCRIPT = `(function(){var t=null;try{t=localStorage.getItem('theme')}catch(e){}if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}})()`;

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement => (
  <html lang="en" suppressHydrationWarning>
    <head>
      {/*
        A plain inline script (not next/script, which queues beforeInteractive
        code for its async runtime) so the theme class is set while the HTML
        is parsed, before first paint — no flash of the wrong theme.
      */}
      <script
        id="theme-init"
        dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
      />
    </head>
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <ScrollProgressBar />
      <Suspense>
        <Navbar />
        {children}
        <Footer />
      </Suspense>
      <Analytics />
      <SpeedInsights />
    </body>
  </html>
);

export default RootLayout;
