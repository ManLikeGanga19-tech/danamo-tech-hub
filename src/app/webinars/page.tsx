"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Newsletter from "@/components/NewsLetter/NewsLetter";
import { Navbar1 } from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Image from "next/image";
import { CalendarDays, Clock, User, PlayCircle, CheckCircle2, Video, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch } from "@/lib/api/client";

interface Webinar {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  host: string;
  image_url: string;
  status: "upcoming" | "past";
  join_url?: string | null;
  replay_url?: string | null;
}

export default function WebinarsPage() {
  const { user } = useAuth();

  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isReplayModalOpen, setIsReplayModalOpen] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [replayUrl, setReplayUrl] = useState("");

  // REUSABLE FETCH FUNCTION
    // REUSABLE FETCH FUNCTION
  const fetchWebinars = useCallback(async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    try {
      const data = await apiFetch<Webinar[]>("/webinars");
      setWebinars(data);
    } catch (err) {
      // Silently ignore network errors during background polling
      // (backend may be restarting, user may be offline, etc.)
      if (err instanceof Error && err.message === "NETWORK_ERROR" && !showSpinner) {
        return;
      }
      // Only log real errors, and only on the initial load
      if (showSpinner) {
        console.error("Failed to load webinars:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // LIVE DATA: Initial fetch + Focus refetch + 60s polling (only when visible)
  useEffect(() => {
    fetchWebinars(true);

    // Refetch when the user returns to the tab
    const onFocus = () => fetchWebinars(false);
    window.addEventListener("focus", onFocus);

    // Poll every 60s — but ONLY when the tab is visible
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchWebinars(false);
      }
    }, 60000);

    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
    };
  }, [fetchWebinars]);

  const handleRegisterClick = (webinar: Webinar) => {
    setSelectedWebinar(webinar);
    setName(user?.full_name || "");
    setEmail(user?.email || "");
    setError(""); setSuccess("");
    setIsRegisterModalOpen(true);
  };

  const handleReplayClick = (webinar: Webinar) => {
    setSelectedWebinar(webinar);
    setEmail(user?.email || "");
    setError(""); setSuccess(""); setReplayUrl("");
    setIsReplayModalOpen(true);
  };

  const submitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError("");
    try {
      await apiFetch("/webinars/register", {
        method: "POST",
        body: JSON.stringify({ webinar_id: selectedWebinar?.id, name, email }),
      });
      setSuccess("Registration successful! Check your email for the link.");
    } catch (err: any) {
      setError(err.message || "Failed to register.");
    } finally { setSubmitting(false); }
  };

  const submitReplayUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError("");
    try {
      const res = await apiFetch<{ replay_url: string }>("/webinars/unlock-replay", {
        method: "POST",
        body: JSON.stringify({ webinar_id: selectedWebinar?.id, email }),
      });
      setReplayUrl(res.replay_url);
    } catch (err: any) {
      setError(err.message || "Failed to unlock replay.");
    } finally { setSubmitting(false); }
  };

  const upcoming = webinars.filter(w => w.status === 'upcoming');
  const past = webinars.filter(w => w.status === 'past');

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Navbar1 />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden flex items-center justify-center text-center px-4">
          <Image src="/webinars/webinars-bg.jpg" alt="Webinar Hero" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
          <div className="relative z-10 max-w-4xl px-4">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6 backdrop-blur-md">
              Live Learning
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Join Our Upcoming <span className="text-blue-500">Tech Webinars</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Master the latest technologies, ask questions live, and accelerate your career with our expert-led sessions.
            </p>
          </div>
        </section>

        {/* Upcoming Webinars */}
        <section className="py-24 px-4 md:px-8 max-w-[85rem] mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Webinars</h2>
            <p className="text-gray-600 dark:text-gray-400">Secure your spot for our next live sessions.</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-100 dark:border-gray-800">
              <p className="text-gray-500 dark:text-gray-400">No upcoming webinars scheduled. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcoming.map((webinar) => (
                <Card key={webinar.id} className="group rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1E1E2F] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="relative w-full h-52 overflow-hidden">
                    <img src={webinar.image_url} alt={webinar.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {webinar.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-4">
                    <div className="space-y-3 mb-6">
                      <p className="flex items-center text-sm text-gray-600 dark:text-gray-300 font-medium"><CalendarDays className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />{webinar.date}</p>
                      <p className="flex items-center text-sm text-gray-600 dark:text-gray-300 font-medium"><Clock className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />{webinar.time}</p>
                      <p className="flex items-center text-sm text-gray-600 dark:text-gray-300 font-medium"><User className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />{webinar.host}</p>
                    </div>
                    <Button onClick={() => handleRegisterClick(webinar)} className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl py-6">
                      Register Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Past Webinars */}
        <section className="py-24 px-4 md:px-8 bg-gray-50 dark:bg-[#0e0e15] w-full border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-[85rem] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Past Webinars</h2>
              <p className="text-gray-600 dark:text-gray-400">Catch up on our previous sessions at your own pace.</p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              </div>
            ) : past.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-100 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400">No past webinars available yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {past.map((webinar) => (
                  <Card key={webinar.id} className="group rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1E1E2F] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="relative w-full h-52 overflow-hidden">
                      <img src={webinar.image_url} alt={webinar.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <PlayCircle className="w-14 h-14 text-white opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                    </div>
                    <CardHeader className="p-6 pb-2">
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{webinar.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{webinar.date}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-6">Host: {webinar.host}</p>
                      <Button onClick={() => handleReplayClick(webinar)} variant="outline" className="w-full border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl py-6">
                        Watch Replay
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        <Newsletter />
      </main>

      <Footer />

      {/* REGISTER MODAL */}
      <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#1E1E2F] border-gray-100 dark:border-gray-800 rounded-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Register for Webinar</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              You are registering for: <strong className="text-blue-600 dark:text-blue-400">{selectedWebinar?.title}</strong>
            </DialogDescription>
          </DialogHeader>
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md mb-4">{error}</div>}
          {success ? (
            <div className="py-8 text-center flex flex-col items-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">You're on the list!</h3>
              <p className="text-gray-600 dark:text-gray-400">{success}</p>
            </div>
          ) : (
            <form onSubmit={submitRegistration} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Email Address</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-xl h-12" />
              </div>

              <Button asChild className="w-full bg-blue-600 text-white rounded-xl py-6 mt-2">
                <button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Registration"}
                </button>
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* REPLAY MODAL */}
      <Dialog open={isReplayModalOpen} onOpenChange={setIsReplayModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#1E1E2F] border-gray-100 dark:border-gray-800 rounded-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Unlock Webinar Replay</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Enter your email to watch the recording of <strong>{selectedWebinar?.title}</strong>.
            </DialogDescription>
          </DialogHeader>
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md mb-4">{error}</div>}

          {replayUrl ? (
            <div className="py-6 text-center flex flex-col items-center">
              <Video className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Replay Unlocked!</h3>
              <Button asChild className="w-full bg-blue-600 text-white rounded-xl py-6">
                <a href={replayUrl} target="_blank" rel="noopener noreferrer">Watch Video Now</a>
              </Button>
            </div>
          ) : (
            <form onSubmit={submitReplayUnlock} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Email Address</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-xl h-12" />
              </div>

              <Button asChild className="w-full bg-blue-600 text-white rounded-xl py-6 mt-2">
                <button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Unlock Replay"}
                </button>
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}