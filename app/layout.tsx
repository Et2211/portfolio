import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";


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
  title: "Portfolio",
  description: "My personal portfolio website",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement => (
  <html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Navbar />
      {children}
      <Analytics />
    </body>
  </html>
);

export default RootLayout;
