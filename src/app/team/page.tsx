"use client"

import { TeamCard } from "@/components/TeamCard/TeamCard";
import { Navbar1 } from "@/components/navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
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
    <>
      <Navbar1 />
      <section className="min-h-screen bg-gradient-to-b from-white to-gray-100  dark:from-[#1E1E2F] dark:to-[#1E1E2F] py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-600 dark:text-blue-400">
            Meet <span className="text-black dark:text-white">Our Team</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => (
              <TeamCard key={i} {...member} />
            ))}
          </div>
          <div className="text-center py-12 bg-gradient-to-b from-white to-gray-100 dark:from-[#1E1E2F] dark:to-[#1E1E2F]  ">
            <Button
              asChild
              size="lg"
              className="bg-white px-6 py-3 text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
            >
              <a href="/careers">Join Us</a>
            </Button>
          </div>

        </div>
      </section>
      <Footer />
    </>
  )
}
