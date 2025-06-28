"use client"

import { Navbar1 } from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import Services from "@/components/ServiceSection/Services";
import About from "@/components/About/About";
import Contact from "@/components/Contact/Contact";
import NewsLetter from "@/components/NewsLetter/NewsLetter";
import Footer from "@/components/Footer/Footer";
// announcement bar temporary
import AnnouncementBar from "@/components/AnnouncementBar";

export default function Home() {
  return (
    <main className="min-h-screen text-black dark:bg-gray-900 dark:text-white">
      <AnnouncementBar/>
      <Navbar1 />
      <div className="flex flex-col">
        <Hero />
        <Services />
        <About />
        <Contact />
        <NewsLetter />
        <Footer />
      </div>
    </main>
  );
}

