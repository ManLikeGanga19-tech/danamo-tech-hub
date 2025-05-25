import Hero from "@/components/hero/Hero";
import Services from "@/components/ServiceSection/Services";

export default function Home() {
  return (
    <main className=" text-black dark:bg-black dark:text-white flex flex-col items-center justify-center">
      <Hero/>
      <Services/>
    </main>
  );
}
