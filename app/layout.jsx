"use client"

import { usePathname } from 'next/navigation';
import localFont from "next/font/local";
import "./globals.css";
import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import TopBar from '@/components/topbar';
import NextTopLoader from 'nextjs-toploader';
import { AuthContextProvider } from '@/context/authContext';
import { Suspense } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isLandingPage = pathname === "/";

  // <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased flex w-screen overflow-x-hidden`}>
        <NextTopLoader showSpinner={false} />
        <ToastContainer 
          position='bottom-right'
        />
        <AuthContextProvider>
          <Sidebar 
            isSidebarOpen={isSidebarOpen} 
            setIsSidebarOpen={setIsSidebarOpen}
            className={`${isLandingPage ? "hidden" : ""}`}
          />

          <div className={`w-full ${isLandingPage ? "" : (isSidebarOpen  ? "sm:ml-64" : "sm:ml-20")}`}>
            <TopBar 
              isSidebarOpen={isSidebarOpen} 
              setIsSidebarOpen={setIsSidebarOpen} 
              className={`${isLandingPage ? "hidden" : ""}`}  
            />
            <main className={`${isLandingPage ? "" : "flex mt-24 w-full"}`}>
              <Suspense>
                {children}
              </Suspense>
            </main>
          </div>
        </AuthContextProvider>
      </body>
    </html>
  );
}