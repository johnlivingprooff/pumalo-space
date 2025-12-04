import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header/Header";
import { Footer } from "@/components/layout/Footer/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@stack/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pumalo Space - Find Your Perfect Property",
  description: "Discover amazing properties for rent, buy, or lodge. Your next home or vacation destination awaits on Pumalo Space.",
  keywords: ["property rental", "buy property", "lodge", "accommodation", "real estate"],
  authors: [{ name: "Pumalo Space" }],
  icons: {
    icon: "/logo_blue.ico",
    shortcut: "/logo_blue.ico",
    apple: "/logo_blue.ico",
  },
  openGraph: {
    title: "Pumalo Space - Find Your Perfect Property",
    description: "Discover amazing properties for rent, buy, or lodge.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <CookieConsent />
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
