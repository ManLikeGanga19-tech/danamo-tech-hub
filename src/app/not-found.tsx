"use client";

import Link from "next/link";
import { Navbar1 } from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
      <Navbar1 />
      
      <main className="flex-grow flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <div className="relative mb-8">
            <h1 className="text-[120px] md:text-[180px] font-extrabold text-gray-100 dark:text-[#1E1E2F] leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
            Oops! The page you are looking for doesn&apos;t exist or has been moved. 
            Let&apos;s get you back on track.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-600/20 text-base px-8 py-6 rounded-xl group"
            >
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 text-base px-8 py-6 rounded-xl"
            >
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}