import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My 3D Shop",
  description: "Shopping system with .NET API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 2. ใช้ CartProvider  */}
        <CartProvider>
          {/* 3. วาง Navbar */}
          <Navbar />
          
          {/* */}
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
