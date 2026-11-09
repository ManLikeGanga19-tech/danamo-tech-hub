"use client"

import { TeamCard } from "@/components/TeamCard/TeamCard";
import { Navbar1 } from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const teamMembers = [
  {
    name: "Daniel Orwenjo",
    role: "CEO & Founder",
    bio: "Visionary leader passionate about building tech for impact.",
    imageUrl: "/images/jane.jpg",
    socials: {
      linkedin: "https://linkedin.com/in/janedoe",
      github: "https://github.com/janedoe",
    },
  },
  {
    name: "John Smith",
    role: "Lead Developer",
    bio: "Full-stack engineer with a love for solving tough problems.",
    imageUrl: "/images/john.jpg",
    socials: {
      linkedin: "https://linkedin.com/in/johnsmith",
      github: "https://github.com/johnsmith",
    },
  },
  {
    name: "Alice Kim",
    role: "UI/UX Designer",
    bio: "Designs delightful experiences with a focus on accessibility.",
    imageUrl: "/images/alice.jpg",
    socials: {
      linkedin: "https://linkedin.com/in/alicekim",
      github: "https://github.com/johnsmith",
    },
  },
]

export default function OurTeamPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
      <Navbar1 />
      
      <main className="flex-grow">
        {/* Team Section */}
        <section className="py-24 px-4 md:px-8 max-w-[85rem] mx-auto w-full">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white">
              Meet <span className="text-blue-600 dark:text-blue-400">Our Team</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The brilliant minds driving innovation and building scalable digital solutions at Danamo Tech.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              We are always looking for passionate, creative, and driven individuals to join our growing team.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-600/20 text-base px-8 py-6 rounded-xl group"
            >
              <a href="/careers" className="flex items-center gap-2">
                View Open Roles
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}