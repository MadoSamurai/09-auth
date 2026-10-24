import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import React from "react";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoFont = Roboto({
  weight: "400",
  subsets: ["latin"],
  variable: "--roboto-font",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NoteHub",
  description: "NoteHub app",
  openGraph: {
    title: "NoteHub",
    description: "NoteHub app",
    url: "notehub url",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub app",
      },
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className={robotoFont.variable}>
        <AuthProvider>
          <TanStackProvider>
            <Header />
            {children}
            {modal}
            <Footer />
          </TanStackProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
