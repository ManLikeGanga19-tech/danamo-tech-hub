import { pageMetadata } from "@/lib/seo";
import { TeamCard } from "@/components/TeamCard/TeamCard";
import { Navbar1 } from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const teamMembers = [
  {
    name: "Daniel Oganga",
    role: "CEO & Founder",
    bio: "Founded Danamo Tech in 2024 in Mombasa to give small businesses and startups access to affordable, enterprise-grade software. Leads product and engineering across Danamo's platforms and client work.",
    socials: {
      github: "https://github.com/ManLikeGanga19-tech",
    },
  },
]

export const metadata = pageMetadata({
  title: "Our Team: Daniel Oganga, Founder & CEO",
  description:
    "Meet Daniel Oganga, founder and CEO of Danamo Tech, the Mombasa software company behind ShuleHQ, WIFI.OS and VendaPOS.",
  path: "/team",
});

export default function OurTeamPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
      <Navbar1 />
      
      <main className="flex-grow">
        {/* Team Section */}
        <section className="py-24 px-4 md:px-8 max-w-[85rem] mx-auto w-full">
          
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white">
              Meet <span className="text-blue-600 dark:text-blue-400">The Founder</span>
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              The person behind Danamo Tech and the products and platforms we build.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 max-w-sm mx-auto">
            {teamMembers.map((member, i) => (
              <TeamCard key={i} {...member} />
            ))}
          </div>
        </section>

        {/* Corporate CTA Section */}
        <section className="py-24 bg-gray-50 dark:bg-[#0e0e15] border-t border-gray-100 dark:border-gray-800 text-center px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Want to build the future with us?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              We are always looking for passionate, creative, and driven individuals to join our growing team.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-600/20 text-base px-8 py-6 rounded-xl group"
            >
              <Link href="/careers" className="flex items-center gap-2">
                View Open Roles
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}