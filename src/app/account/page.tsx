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
          subject: interest, // maps the "I am interested in..." dropdown to the contact subject
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
    <section className="w-full py-[15px] transition-colors duration-700 bg-gradient-to-b from-gray-100 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
      <div className="layout">
        <div className="grid lg:grid-cols-2 items-center gap-14 py-10">
          {/* Contact Info */}
          <div className="flex flex-col items-center lg:items-start">
            <h1 className="text-4xl font-semibold text-blue-600 dark:text-blue-400">
              Contact <span className="text-black dark:text-white">Us</span>
            </h1>
            <p className="text-lg text-black dark:text-white mt-6 leading-relaxed max-w-xl">
              Have some big idea or brand to develop and need help? Then reach out we&apos;d love to hear about your project and provide help.
            </p>

            <ul className="mt-12 space-y-8 w-full max-w-md">
              <li className="flex items-center">
                <Mail className="text-blue-600 dark:text-blue-400" size={20} />
                <a href="mailto:danamotech@gmail.com" className="text-black dark:text-white text-sm ml-4 hover:no-underline">
                  danamotech@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="text-blue-600 dark:text-blue-400" size={20} />
                <a href="tel:+254785640048" className="text-black dark:text-white text-sm ml-4 hover:no-underline">
                  +254785640048
                </a>
              </li>
              <li className="flex items-center">
                <MapPin className="text-blue-600 dark:text-blue-400" size={20} />
                <span className="text-black dark:text-white text-sm ml-4">
                  Nairobi, Kenya
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div className="flex justify-center w-full">
            <Card className="w-full max-w-md border-blue-400">
              <CardHeader>
                <CardDescription>
                  {loading
                    ? "Checking login status..."
                    : user
                      ? "Fill out the form and we will get back to you shortly."
                      : "Please log in to send a message."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-md">
                    <p className="text-green-600 text-sm">{success}</p>
                  </div>
                )}
                <form id="contact-form" onSubmit={handleSubmit} className="grid w-full gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name" className="text-blue-600 dark:text-blue-400">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      className="placeholder:text-gray-900 dark:placeholder:text-white"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!user || loading || submitting}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email" className="text-blue-600 dark:text-blue-400">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      className="placeholder:text-gray-900 dark:placeholder:text-white"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!user || loading || submitting}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="interest" className="text-blue-600 dark:text-blue-400">I am interested in...</Label>
                    <Select
                      value={interest}
                      onValueChange={setInterest}
                      disabled={!user || loading || submitting}
                    >
                      <SelectTrigger id="interest">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-100 dark:text-white dark:bg-[#1E1E2F]">
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
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="message" className="text-blue-600 dark:text-blue-400">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your project..."
                      rows={4}
                      className="placeholder:text-gray-900 dark:placeholder:text-white"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={!user || loading || submitting}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                {user ? (
                  <Button asChild>
                    <button
                      type="submit"
                      form="contact-form"
                      disabled={loading || submitting}
                      className="bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white px-4 py-2 rounded-md flex items-center"
                    >
                      <Send size={12} className="mr-2 animate-pulse" />
                      {submitting ? "Sending..." : "Send Message"}
                    </button>
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
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