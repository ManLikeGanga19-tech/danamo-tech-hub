"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch } from "@/lib/api/client";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("Please log in to submit the form.");
      return;
    }

    if (!name || !email || !interest || !message) {
      setError("All fields are required.");
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          subject: interest,
          message,
        }),
      });
      setSuccess("Message sent successfully!");
      setName("");
      setEmail("");
      setInterest("");
      setMessage("");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      let msg = "Failed to send message.";
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
    <section 
      id="contact" 
      className="w-full py-24 scroll-mt-24 transition-colors duration-700 bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F] overflow-hidden"
    >
      <div className="layout w-full max-w-[85rem] mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white">
            Contact <span className="text-blue-600 dark:text-blue-400">Us</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a big idea or brand to develop? Reach out and let&apos;s build something great together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 items-center gap-16 lg:gap-24 py-4">
          
          <div className="flex flex-col items-start lg:pr-10">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Let&apos;s discuss your next project.
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-xl">
              We are ready to help you scale. Whether you need a new website, a custom software solution, or expert IT consulting, our team is here to answer your questions.
            </p>

            <ul className="space-y-6 w-full max-w-md">
              <li className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#1E1E2F] shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10">
                  <Mail className="text-blue-600 dark:text-blue-400" size={22} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Us</p>
                  <a href="mailto:danamotech@gmail.com" className="text-gray-900 dark:text-white font-semibold hover:text-blue-600 transition-colors">
                    danamotech@gmail.com
                  </a>
                </div>
              </li>
              
              <li className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#1E1E2F] shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10">
                  <Phone className="text-blue-600 dark:text-blue-400" size={22} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Call Us</p>
                  <a href="tel:+254785640048" className="text-gray-900 dark:text-white font-semibold hover:text-blue-600 transition-colors">
                    +254 785 640 048
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#1E1E2F] shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10">
                  <MapPin className="text-blue-600 dark:text-blue-400" size={22} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Visit Us</p>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    Mombasa, Kenya
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex justify-center w-full">
            <Card className="w-full max-w-xl rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-[#1E1E2F]/60 backdrop-blur-sm shadow-2xl shadow-blue-500/5">
              <CardHeader className="pb-6">
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  {loading
                    ? "Checking login status..."
                    : user
                      ? "Fill out the form and we will get back to you shortly."
                      : "Please log in to send a message."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-md">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 rounded-md">
                    <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
                  </div>
                )}
                <form id="contact-form" onSubmit={handleSubmit} className="grid w-full gap-5">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      className="rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder:text-gray-400"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!user || loading || submitting}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      className="rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder:text-gray-400"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!user || loading || submitting}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="interest" className="text-gray-700 dark:text-gray-300 font-medium">I am interested in...</Label>
                    <Select
                      value={interest}
                      onValueChange={setInterest}
                      disabled={!user || loading || submitting}
                    >
                      <SelectTrigger id="interest" className="rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-[#1E1E2F] rounded-xl border-gray-200 dark:border-gray-700">
                        <SelectItem value="web">Web Development</SelectItem>
                        <SelectItem value="seo">Search Engine Optimization</SelectItem>
                        <SelectItem value="branding">Branding & UI/UX Design</SelectItem>
                        <SelectItem value="marketing">Social Media & Digital Marketing</SelectItem>
                        <SelectItem value="ecommerce">E-Commerce</SelectItem>
                        <SelectItem value="consulting">IT Consulting and Support</SelectItem>
                        <SelectItem value="saas">SaaS Product Development</SelectItem>
                        <SelectItem value="cloud">Cloud & DevOps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="message" className="text-gray-700 dark:text-gray-300 font-medium">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your project..."
                      rows={5}
                      className="rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder:text-gray-400 resize-none"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={!user || loading || submitting}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end pt-2 pb-6 px-6">
                {user ? (
                  <Button asChild>
                    <button
                      type="submit"
                      form="contact-form"
                      disabled={loading || submitting}
                      className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-600/20 text-base px-8 py-6 rounded-xl flex items-center justify-center"
                    >
                      <Send size={18} className={`mr-2 ${submitting ? "animate-pulse" : ""}`} />
                      {submitting ? "Sending..." : "Send Message"}
                    </button>
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-600/20 text-base px-8 py-6 rounded-xl"
                  >
                    <a href="/login">Log in to Send</a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;