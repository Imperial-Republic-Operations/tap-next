import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper";
import React from "react";
import { NotificationProvider } from "@/components/NotificationProvider";
import { getSession } from "@/lib/auth";
import ScrollLockPreventer from "@/components/ScrollLockPreventer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session } = await getSession();
  const userId = session?.user?.id;

  return (
    <html lang="en">
    <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col overflow-auto bg-white dark:bg-gray-900 dark:text-white`}
    >
    <NotificationProvider userId={userId}>
      <ScrollLockPreventer />
      <nav id="header-wrapper" className="bg-white/80 backdrop-blur-md shadow-sm dark:bg-gray-800/80 dark:shadow-none top-0 z-50">
      {/*<div className="sticky top-0 z-50">*/}
        <Header />
        <BreadcrumbWrapper />
      {/*</div>*/}
      </nav>
      {children}
    </NotificationProvider>
    </body>
    </html>
  );
}
