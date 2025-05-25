import Hero from "@/components/hero/Hero";
import Services from "@/components/ServiceSection/Services";
import About from "@/components/About/About";

export default function Home() {
  return (
    <main className=" text-black dark:bg-gray-900 dark:text-white flex flex-col items-center justify-center">
      <Hero/>
      <Services/>
      <About/>
    </main>
  );
}
