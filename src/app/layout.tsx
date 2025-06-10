import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { inter, montserrat, jetbrainsMono } from './fonts';
import "./globals.css";
import Providers from "./providers/ReduxProvider";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mock Api Playground",
  description: "Mock API Playground is a tool for creating and testing mock APIs quickly and easily.",
  icons:{
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${montserrat.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <ToastContainer
            toastClassName={'my-toast'}
          />
        </Providers>
      </body>
    </html>
  );
}
