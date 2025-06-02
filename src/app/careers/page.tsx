"use client"

import { Navbar1 } from "@/components/navbar/Navbar"
import Footer from "@/components/Footer/Footer"
import { Laptop, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
const jobListings = [
  {
    title: "Frontend Developer",
    type: "Full-time",
    location: "Remote",
    description: "Build responsive web apps with React and Next.js.",
  },
  {
    title: "Backend Engineer",
    type: "Full-time",
    location: "Nairobi, Kenya",
    description: "Design APIs and infrastructure using Node.js or Python.",
  },
  {
    title: "UI/UX Designer",
    type: "Part-time",
    location: "Remote",
    description: "Craft intuitive and delightful user experiences.",
  },
]

export default function CareersPage() {
  return (
    <>
      <Navbar1 />

      {/* Shared background section for Hero + Culture */}
      <section className="relative bg-[url('/careers-hero.jpg')] bg-cover bg-center bg-fixed text-white">
        {/* Hero */}
        <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 py-24 bg-black/50 dark:bg-black/60">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Join Our Innovative Team</h1>
          <p className="text-lg max-w-2xl text-gray-200">
            Help us build the future of tech at Danamo. Discover open roles and shape the world with your skills.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
          >
            <a href="#openings">See Open Roles</a>
          </Button>
        </div>

        {/* Culture */}
        <div className="w-full py-20 backdrop-blur-sm bg-white/70 dark:bg-black/40 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Our Culture</h2>
            <p className="text-lg text-gray-800 dark:text-gray-300">
              At Danamo Tech, we value collaboration, creativity, and a constant drive to improve.
              Every team member is empowered to make a difference and contribute to our mission.
            </p>
          </div>
        </div>
      </section>

      {/* JOB OPENINGS SECTION */}
      <section id="openings" className="py-16  bg-gradient-to-b from-white to-gray-100 dark:from-[#1E1E2F] dark:to-[#0e0e15] text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-600 dark:text-blue-400">
            Open Positions
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {jobListings.map((job, idx) => (
              <div
                key={idx}
                className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-md bg-gray-50 dark:bg-[#2A2A3D]"
              >
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  {job.title}
                </h3>
                <p className="text-sm mb-1">{job.type} • {job.location}</p>
                <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">{job.description}</p>
                <Button
                  asChild
                  size="lg"
                  className="inline-block px-4 py-2 bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                >
                  <a href="/apply">Apply</a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="py-16  bg-gradient-to-b from-gray-100 to-white dark:from-[#0e0e15]  dark:to-[#1E1E2F] text-white text-center px-4">
        <h2 className="text-3xl text-black dark:text-white font-bold mb-4">Ready to make an impact?</h2>
        <p className="mb-6 text-lg text-black dark:text-white">We&apos;re always looking for passionate and creative individuals.</p>
        <Button
          asChild
          size="lg"
          className=" px-6 py-3 bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
        >
          <a href="/apply">Apply Now</a>
        </Button>
      </section>

      {/* Perks Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-100 dark:from-[#1E1E2F] dark:to-[#0e0e15]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-black dark:text-white">Why Join Us?</h2>
          <div className="grid gap-8 md:grid-cols-3 text-center">
            {[
              {
                icon: <Laptop className="w-10 h-10 mx-auto mb-4 text-blue-600 dark:text-blue-400 animate-pulse" />,
                title: "Remote Friendly",
                description: "Work from anywhere with flexible hours and great support.",
              },
              {
                icon: <TrendingUp className="w-10 h-10 mx-auto mb-4 text-blue-600 dark:text-blue-400 animate-pulse" />,
                title: "Growth Opportunities",
                description: "We invest in your career through mentorship and learning.",
              },
              {
                icon: <Users className="w-10 h-10 mx-auto mb-4 text-blue-600 dark:text-blue-400 animate-pulse" />,
                title: "Supportive Team",
                description: "Join a team that cares about collaboration and well-being.",
              },
            ].map((perk, i) => (
              <div key={i} className="p-6 bg-gray-100 dark:bg-[#2A2A3D] rounded-lg shadow">
                {perk.icon}
                <h4 className="text-xl font-semibold mb-2 text-black dark:text-white">{perk.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{perk.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
