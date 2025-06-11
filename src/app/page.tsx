import { Navbar1 } from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import Services from "@/components/ServiceSection/Services";
import About from "@/components/About/About";
import Contact from "@/components/Contact/Contact";
import NewsLetter from "@/components/NewsLetter/NewsLetter";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <main className=" text-black dark:bg-gray-900 dark:text-white flex flex-col ">
      <Navbar1/>
      <Hero />
      <Services />
      <About />
      <Contact />
      <NewsLetter/>
      <Footer/>
    </main>
  );
}

{/* <Button
  asChild
  onClick={handleSave}
  className={`bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''} `}
>
  <button type="button" disabled={isSubmitted}
  >
    Save Changes
  </button>
</Button> */}
