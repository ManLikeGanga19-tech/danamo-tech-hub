"use client";

import { useState, useRef } from "react";
import { Navbar1 } from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Laptop, TrendingUp, Users, MapPin, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch } from "@/lib/api/client";
import Image from "next/image";

const jobListings = [
  {
    title: "Frontend Developer",
    type: "Full-time",
    location: "Remote",
    description: "Build responsive, enterprise-grade web apps with React, Next.js, and Tailwind CSS.",
  },
  {
    title: "Backend Engineer",
    type: "Full-time",
    location: "Mombasa, Kenya",
    description: "Design scalable APIs, manage databases, and build robust infrastructure using Python or Node.js.",
  },
  {
    title: "UI/UX Designer",
    type: "Part-time",
    location: "Remote",
    description: "Craft intuitive, accessible, and visually stunning user experiences for our clients.",
  },
];

export default function CareersPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<null | typeof jobListings[0]>(null);
  const [cvError, setCvError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loading = authLoading || submitting;

  const openModal = (job: typeof jobListings[0]) => {
    setSelectedJob(job);
    setIsOpen(true);
    setName("");
    setEmail("");
    setCoverLetter("");
    setSelectedFile(null);
    setCvError("");
    setError("");
    setSuccess("");
  };

  const closeModal = () => {
    setSelectedJob(null);
    setIsOpen(false);
    setName("");
    setEmail("");
    setCoverLetter("");
    setSelectedFile(null);
    setCvError("");
    setError("");
    setSuccess("");
  };

  // FIX: Changed to HTMLDivElement because the onClick is on a <div>
  const handleCvClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setCvError("Only PDF files are allowed.");
      setSelectedFile(null);
      e.target.value = "";
    } else if (file.size > 5 * 1024 * 1024) {
      setCvError("File size must be less than 5MB.");
      setSelectedFile(null);
      e.target.value = "";
    } else {
      setCvError("");
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    if (!user) {
      setError("Please log in to apply.");
      setSubmitting(false);
      return;
    }

    if (!name || !email || !coverLetter || !selectedFile || !selectedJob) {
      setError("All fields and CV are required.");
      setSubmitting(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("full_name", name);
      fd.append("email", email);
      fd.append("role_slug", selectedJob.title);
      fd.append("cover_letter", coverLetter);
      fd.append("cv", selectedFile);

      await apiFetch("/careers/apply", { method: "POST", body: fd });

      setSuccess("Application submitted successfully!");
      setName("");
      setEmail("");
      setCoverLetter("");
      setSelectedFile(null);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess("");
      }, 3000);
    } catch (err: unknown) {
      let msg = "Failed to submit application.";
      if (err instanceof Error) {
        const raw = err.message.replace(/^API \d+: /, "");
        try {
          const parsed = JSON.parse(raw);
          if (typeof parsed?.detail === "string") msg = parsed.detail;
          else msg = raw || msg;
        } catch {
          msg = raw || msg;
        }
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

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
            <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
          </div>
          <div className="relative z-10 max-w-4xl px-4">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6 backdrop-blur-md">
              Join the Team
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">
              Build the Future <span className="text-blue-500">With Us</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
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
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            At Danamo Tech, we value collaboration, creativity, and a constant drive to improve.
            Every team member is empowered to make a difference and contribute to our mission of bridging the technology gap.
          </p>
        </section>

        {/* Openings */}
        <section id="openings" className="py-24 bg-gray-50 dark:bg-[#0e0e15] border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-[85rem] mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Open Positions</h2>
              <p className="text-gray-600 dark:text-gray-400">Find your next role and grow with us.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {jobListings.map((job, idx) => (
                <div key={idx} className="group relative flex flex-col bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-full px-3 py-1">
                      <Briefcase className="w-3 h-3 mr-1.5" /> {job.type}
                    </span>
                    <span className="flex items-center text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
                      <MapPin className="w-3 h-3 mr-1.5" /> {job.location}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 flex-grow leading-relaxed">
                    {job.description}
                  </p>

                  <Button
                    onClick={() => openModal(job)}
                    className="w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white transition-colors duration-300 rounded-xl"
                  >
                    Apply for this Role
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Perks */}
        <section className="py-24 px-4 md:px-8 max-w-[85rem] mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Join Us?</h2>
            <p className="text-gray-600 dark:text-gray-400">We take care of our team so they can take care of the future.</p>
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
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{perk.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Corporate CTA */}
        <section className="py-20 bg-gradient-to-b from-transparent to-gray-100 dark:to-[#1E1E2F] text-center px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to make an impact?</h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
              We&apos;re always looking for passionate and creative individuals to join our mission.
            </p>
            <Button
              onClick={() => openModal(jobListings[0])}
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-600/20 text-base px-8 py-6 rounded-xl"
            >
              Apply Now
            </Button>
          </div>
        </section>
      </main>

      <Footer />

      {/* Premium Apply Modal */}
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent className="sm:max-w-xl bg-white dark:bg-[#1E1E2F] border-gray-100 dark:border-gray-800 rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Apply for {selectedJob?.title}
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
              {loading ? (
                "Checking login status..."
              ) : user ? (
                <>
                  <span className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-full px-3 py-1 mt-2 mr-2">
                    <Briefcase className="w-3 h-3 mr-1.5" /> {selectedJob?.type}
                  </span>
                  <span className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 mt-2">
                    <MapPin className="w-3 h-3 mr-1.5" /> {selectedJob?.location}
                  </span>
                  <span className="block mt-4 text-sm">{selectedJob?.description}</span>
                </>
              ) : (
                "Please log in to submit an application."
              )}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-md">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 rounded-md">
              <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
            </div>
          )}

          {user ? (
            <form id="application-form" onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-12"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-12"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cover Letter</label>
                <Textarea
                  rows={4}
                  placeholder="Tell us why you're a great fit..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                  className="w-full rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 resize-none"
                  disabled={loading}
                />
              </div>

              {/* Upload CV */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Resume / CV (PDF only, max 5MB)</label>
                <div
                  onClick={handleCvClick}
                  className="flex items-center justify-between w-full p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate pr-4">
                    {selectedFile ? selectedFile.name : "Click to upload your CV"}
                  </span>
                  {/* FIX: Used asChild to prevent TypeScript 'type' error */}
                  <Button asChild variant="outline" size="sm" className="rounded-lg pointer-events-none">
                    <button type="button">Browse</button>
                  </Button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="application/pdf"
                  style={{ display: "none" }}
                />
                {cvError && (
                  <p className="text-red-600 mt-1 text-sm">{cvError}</p>
                )}
              </div>

              <Button
                asChild
                className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-600/20 rounded-xl py-6 mt-4"
              >
                <button type="submit" form="application-form" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </Button>
            </form>
          ) : (
            <Button
              asChild
              className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-600/20 rounded-xl py-6 mt-4"
            >
              <a href="/login">Log in to Apply</a>
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}