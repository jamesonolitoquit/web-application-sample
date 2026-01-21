import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/contexts/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Financial Tools Suite - Jameson A. Olitoquit",
  description: "A comprehensive suite of financial tools including expense tracker, budget planner, loan calculator, savings goal tracker, currency converter, and investment calculator. Built with React and TypeScript.",
  icons: {
    icon: '/favicon.svg',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <footer className="bg-gray-900 text-white py-6 mt-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-sm">
              Built by <span className="font-semibold">Jameson A. Olitoquit</span> | 
              Contact: <a href="mailto:jameson.olitoquit@gmail.com" className="text-blue-400 hover:text-blue-300">jameson.olitoquit@gmail.com</a>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Portfolio Demo - Financial Tools Suite
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
