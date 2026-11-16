import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";
import { Navbar1 } from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Laptop, TrendingUp, Users, MapPin, Briefcase, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL } from "@/lib/site";
import { getOpenJobs } from "@/lib/jobs";

export const metadata = pageMetadata({
  title: "Careers: Tech Jobs in Mombasa & Remote",
  description:
    "Join Danamo Tech in Mombasa, Kenya. See open software engineering and design roles, read the full job descriptions and apply online with your CV.",
  path: "/careers",
});

export const revalidate = 60;

export default async function CareersPage() {
  const jobs = await getOpenJobs();
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
      <Navbar1 />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] w-full flex items-center justify-center text-center px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/careers-hero.jpg"
              alt="Careers Hero Background"
              fill
              className="object-cover object-center"
              priority
              quality={85}
            />
            <div className="absolute inset-0 hero-scrim" />
          </div>
          <div className="relative z-10 max-w-4xl px-4">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6 backdrop-blur-md">
              Join the Team
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">
              Build the Future <span className="text-blue-500">With Us</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto mb-10">
              Help us build the future of tech at Danamo. Discover open roles and shape the world with your skills.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-600/20 text-base px-8 py-6 rounded-xl group"
            >
              <a href="#openings" className="flex items-center gap-2">
                See Open Roles
                <ArrowRight className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </a>
            </Button>
          </div>
        </section>

        {/* Culture Section */}
        <section className="py-24 px-4 md:px-8 max-w-[85rem] mx-auto w-full text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Our Culture</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            At Danamo Tech, we value collaboration, creativity, and a constant drive to improve.
            Every team member is empowered to make a difference and contribute to our mission of bridging the technology gap.
          </p>
        </section>

        {/* Openings */}
        <section id="openings" className="py-24 bg-gray-50 dark:bg-[#0e0e15] border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-[85rem] mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Open Positions</h2>
              <p className="text-gray-700 dark:text-gray-300">Find your next role and grow with us.</p>
            </div>

            {jobs.length === 0 ? (
              <div className="max-w-xl mx-auto text-center p-10 bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-100 dark:border-gray-800">
                <Briefcase className="w-10 h-10 mx-auto mb-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No open roles right now</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  We&apos;re not hiring for a specific role at the moment, but we&apos;re always happy to hear from talented people.
                </p>
                <a href={`mailto:${CONTACT_EMAIL}?subject=Career%20enquiry`} className="inline-flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-300 hover:underline">
                  <Mail className="w-4 h-4" aria-hidden="true" /> {CONTACT_EMAIL}
                </a>
              </div>
            ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <Link
                  key={job.slug}
                  href={`/careers/${job.slug}`}
                  className="group relative flex flex-col bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 hover:-translate-y-1 p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="flex items-center text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10 rounded-full px-3 py-1">
                      <Briefcase className="w-3 h-3 mr-1.5" aria-hidden="true" /> {job.employment_type}
                    </span>
                    <span className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
                      <MapPin className="w-3 h-3 mr-1.5" aria-hidden="true" /> {job.location}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-8 flex-grow leading-relaxed">
                    {job.summary}
                  </p>

                  <span className="inline-flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-300">
                    View role &amp; apply
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
            )}
          </div>
        </section>

        {/* Perks */}
        <section className="py-24 px-4 md:px-8 max-w-[85rem] mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Join Us?</h2>
            <p className="text-gray-700 dark:text-gray-300">We take care of our team so they can take care of the future.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Laptop className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                title: "Remote Friendly",
                description: "Work from anywhere with flexible hours and great support.",
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                title: "Growth Opportunities",
                description: "We invest in your career through mentorship and continuous learning.",
              },
              {
                icon: <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                title: "Supportive Team",
                description: "Join a team that cares about collaboration, innovation, and well-being.",
              },
            ].map((perk, i) => (
              <div key={i} className="p-8 bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-6">
                  {perk.icon}
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{perk.title}</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{perk.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Corporate CTA */}
        <section className="py-20 bg-gradient-to-b from-transparent to-gray-100 dark:to-[#1E1E2F] text-center px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to make an impact?</h2>
            <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
              We&apos;re always looking for passionate and creative individuals to join our mission.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-600/20 text-base px-8 py-6 rounded-xl"
            >
              <a href="#openings">See Open Roles</a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
