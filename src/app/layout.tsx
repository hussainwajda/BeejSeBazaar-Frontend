import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/hooks/useLanguage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BeejSeBazaar - Farmer's Dashboard",
  description: "A comprehensive mobile-first dashboard for farmers with real-time soil health monitoring, weather alerts, market prices, and agricultural guidance.",
  keywords: ["BeejSeBazaar", "farming", "agriculture", "dashboard", "soil health", "weather", "market prices", "farmer app"],
  authors: [{ name: "BeejSeBazaar Team" }],
  openGraph: {
    title: "BeejSeBazaar - Farmer's Dashboard",
    description: "Comprehensive mobile-first dashboard for farmers with real-time monitoring and agricultural guidance",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeejSeBazaar - Farmer's Dashboard",
    description: "Comprehensive mobile-first dashboard for farmers",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
