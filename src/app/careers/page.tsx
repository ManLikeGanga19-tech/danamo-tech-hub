"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar1 } from "@/components/navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Laptop, TrendingUp, Users } from "lucide-react";
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
import { account, appwriteClient } from "@/lib/appwriteServices";
import { Models, Databases, ID } from "appwrite";

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
];

export default function CareersPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<null | typeof jobListings[0]>(null);
  // States for CV upload logic
  const [cvError, setCvError] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check user authentication
  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const openModal = (job: typeof jobListings[0]) => {
    setSelectedJob(job);
    setIsOpen(true);
    // Reset form state on modal open
    setName("");
    setEmail("");
    setCoverLetter("");
    setSelectedFileName("");
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
    setSelectedFileName("");
    setCvError("");
    setError("");
    setSuccess("");
  };

  const handleCvClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setCvError("Only PDF files are allowed.");
      setSelectedFileName("");
      e.target.value = "";
    } else {
      setCvError("");
      setSelectedFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("Please log in to apply.");
      return;
    }

    if (!name || !email || !coverLetter || !selectedFileName || !selectedJob) {
      setError("All fields and CV are required.");
      return;
    }

    try {
      const databases = new Databases(appwriteClient);
      await databases.createDocument(
        "6840196a001ea51cd944", // Replace with your Database ID
        "68409914002dcbfd0242", // Replace with your Collection ID
        ID.unique(),
        {
          userID: user.$id,
          name,
          email,
          coverLetter,
          cvFileName: selectedFileName,
          jobTitle: selectedJob.title,
          createdAt: new Date().toISOString(),
        }
      );
      setSuccess("Application submitted successfully!");
      setName("");
      setEmail("");
      setCoverLetter("");
      setSelectedFileName("");
      setIsOpen(false);
    } catch (err: unknown) {
      console.error("Appwrite database error:", JSON.stringify(err, null, 2));
      const errorMessage = err instanceof Error ? err.message : "Failed to submit application.";
      setError(errorMessage);
    }
  };

  return (
    <>
      <Navbar1 />

      {/* Hero & Culture */}
      <section className="relative bg-[url('/careers-hero.jpg')] bg-cover bg-center bg-fixed text-white">
        <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 py-24 bg-black/50 dark:bg-black/60">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Join Our Innovative Team</h1>
          <p className="text-lg max-w-2xl text-gray-200">
            Help us build the future of tech at Danamo. Discover open roles and shape the world with your skills.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-white text-blue-600 border border-blue-600 dark:border-blue-500 hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600"
          >
            <a href="#openings">See Open Roles</a>
          </Button>
        </div>

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

      {/* Openings */}
      <section id="openings" className="py-16 bg-gradient-to-b from-white to-gray-100 dark:from-[#1E1E2F] dark:to-[#0e0e15] text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-600 dark:text-blue-400">
            Open Positions
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {jobListings.map((job, idx) => (
              <div key={idx} className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-md bg-gray-50 dark:bg-[#2A2A3D]">
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">{job.title}</h3>
                <p className="text-sm mb-1">{job.type} • {job.location}</p>
                <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">{job.description}</p>
                <Button
                  size="lg"
                  onClick={() => openModal(job)}
                  className="bg-white text-blue-600 border border-blue-600 dark:border-blue-500 hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600"
                >
                  Apply
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-b from-gray-100 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F] text-center px-4">
        <h2 className="text-3xl text-black dark:text-white font-bold mb-4">Ready to make an impact?</h2>
        <p className="mb-6 text-lg text-black dark:text-white">
          We&apos;re always looking for passionate and creative individuals.
        </p>
        <Button
          onClick={() => openModal(jobListings[0])}
          size="lg"
          className="px-6 py-3 bg-white text-blue-600 border border-blue-600 dark:border-blue-500 hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600"
        >
          Apply Now
        </Button>
      </section>

      {/* Perks */}
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

      {/* APPLY MODAL */}
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent className="sm:max-w-md bg-gradient-to-b from-gray-100 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
          <DialogHeader>
            <DialogTitle className="text-lg text-blue-600 dark:text-blue-400">
              Apply for {selectedJob?.title}
            </DialogTitle>
            <DialogDescription>
              {loading ? (
                "Checking login status..."
              ) : user ? (
                <>
                  <span><strong>Type:</strong> {selectedJob?.type}</span><br />
                  <span><strong>Location:</strong> {selectedJob?.location}</span><br />
                  <span><strong>Description:</strong> {selectedJob?.description}</span>
                </>
              ) : (
                "Please log in to submit an application."
              )}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-md">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          {user ? (
            <form id="application-form" onSubmit={handleSubmit} className="space-y-4 mt-4">
              <Input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
                disabled={loading}
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
                disabled={loading}
              />
              <Textarea
                rows={4}
                placeholder="Cover Letter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
                disabled={loading}
              />

              {/* Upload CV link and hidden file input */}
              <div>
                <a
                  href="#"
                  onClick={handleCvClick}
                  className="text-blue-600 underline cursor-pointer select-none"
                  title="Click to upload or change your CV"
                >
                  {selectedFileName || "Upload CV"}
                </a>
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
                className="bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
              >
                <button type="submit" form="application-form" disabled={loading}>
                  Submit Application
                </button>
              </Button>
            </form>
          ) : (
            <Button
              asChild
              className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <a href="/login">Log in to Apply</a>
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}