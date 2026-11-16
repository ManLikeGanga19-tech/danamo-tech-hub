import { pageMetadata } from "@/lib/seo";
import { Navbar1 } from "@/components/Navbar/Navbar";
import Hero from "@/components/hero/Hero";
import Services from "@/components/ServiceSection/Services";
import About from "@/components/About/About";
import Contact from "@/components/Contact/Contact";
import NewsLetter from "@/components/NewsLetter/NewsLetter";
import Footer from "@/components/Footer/Footer";
import PartnersSlider from "@/components/Partners/PartnersSlider";
// announcement bar temporary
// import AnnouncementBar from "@/components/AnnouncementBar";

export const metadata = pageMetadata({
  title: "Software Development Company in Mombasa | Danamo Tech",
  absoluteTitle: true,
  description:
    "Danamo Tech builds custom websites, web and mobile apps, SaaS products and M-Pesa integrated business systems for companies and schools in Mombasa and across Kenya.",
  path: "/",
});

export default function Home() {
  return (
    <main className=" text-black dark:bg-gray-900 dark:text-white flex flex-col ">
      {/* <AnnouncementBar/> */}
      <Navbar1 />
      <Hero />
      <Services />
      <About />
      <PartnersSlider />  
      <Contact />
      <NewsLetter />
      <Footer />
    </main>
  );
}

