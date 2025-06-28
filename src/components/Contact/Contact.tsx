"use client";

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
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
import { account, appwriteClient } from "@/lib/appwriteServices";
import { Models, Databases, ID } from "appwrite";

function Contact() {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  // User and loading state
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);
  // Feedback state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if user is logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        console.error("Session check error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  // Handle form submission
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

    try {
      const databases = new Databases(appwriteClient);
      await databases.createDocument(
        "6840196a001ea51cd944", // appwrite Database ID
        "68401a06000f652d677d", // appwrite Collection ID
        ID.unique(),
        {
          userID: user.$id,
          name,
          email,
          interest,
          message,
          createdAt: new Date().toISOString(),
        }
      );
      setSuccess("Message sent successfully!");
      // Reset form
      setName("");
      setEmail("");
      setInterest("");
      setMessage("");
    } catch (err: unknown) {
      console.error("Appwrite database error:", JSON.stringify(err, null, 2));
      const errorMessage = err instanceof Error ? err.message : "Failed to send message.";
      setError(errorMessage);
    }
  };

  return (
    <section
      className="relative w-full py-16 sm:py-20 lg:py-24 transition-colors duration-700 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950/20 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Contact{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Us
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Have a big idea or brand to develop and need help? Then reach out — we'd love to hear about your project and provide help.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 items-start gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Get in Touch</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Ready to transform your digital presence? Let's start a conversation about your project.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-300">
                <div className="flex-shrink-0 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <Mail className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Email Us</h4>
                  <a href="mailto:danamotech@gmail.com" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">
                    danamotech@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-300">
                <div className="flex-shrink-0 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <Phone className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Call Us</h4>
                  <a href="tel:+254785640048" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">
                    +254 785 640 048
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-300">
                <div className="flex-shrink-0 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <MapPin className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Visit Us</h4>
                  <span className="text-gray-600 dark:text-gray-300">Nairobi, Kenya</span>
                </div>
              </div>
            </div>

            {/* Response time info */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-xl border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Quick Response Time</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We typically respond to all inquiries within 24 hours during business days.
              </p>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="w-full">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl">
              <CardHeader className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Send us a Message</h3>
                <CardDescription className="text-base">
                  {loading ? "Checking login status..." : user ? "Fill out the form and we will get back to you shortly." : "Please log in to send a message."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="p-4 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-green-600 dark:text-green-400 text-sm font-medium">{success}</p>
                  </div>
                )}
                <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      className="h-12 text-base border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!user || loading}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="your.email@example.com"
                      className="h-12 text-base border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!user || loading}
                    />
                  </div>

                  {/* Interest Dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="interest" className="text-sm font-semibold text-gray-700 dark:text-gray-300">I am interested in...</Label>
                    <Select value={interest} onValueChange={setInterest} disabled={!user || loading}>
                      <SelectTrigger id="interest" className="h-12 text-base border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <SelectItem value="web" className="py-3 hover:bg-blue-50 dark:hover:bg-blue-950 focus:bg-blue-50 dark:focus:bg-blue-950">Web Development</SelectItem>
                        <SelectItem value="seo" className="py-3 hover:bg-blue-50 dark:hover:bg-blue-950 focus:bg-blue-50 dark:focus:bg-blue-950">Search Engine Optimization</SelectItem>
                        <SelectItem value="branding" className="py-3 hover:bg-blue-50 dark:hover:bg-blue-950 focus:bg-blue-50 dark:focus:bg-blue-950">Branding & UI/UX Design</SelectItem>
                        <SelectItem value="marketing" className="py-3 hover:bg-blue-50 dark:hover:bg-blue-950 focus:bg-blue-50 dark:focus:bg-blue-950">Social Media & Digital Marketing</SelectItem>
                        <SelectItem value="ecommerce" className="py-3 hover:bg-blue-50 dark:hover:bg-blue-950 focus:bg-blue-50 dark:focus:bg-blue-950">E-Commerce</SelectItem>
                        <SelectItem value="consulting" className="py-3 hover:bg-blue-50 dark:hover:bg-blue-950 focus:bg-blue-50 dark:focus:bg-blue-950">IT Consulting and Support</SelectItem>
                        <SelectItem value="saas" className="py-3 hover:bg-blue-50 dark:hover:bg-blue-950 focus:bg-blue-50 dark:focus:bg-blue-950">SaaS Product Development</SelectItem>
                        <SelectItem value="cloud" className="py-3 hover:bg-blue-50 dark:hover:bg-blue-950 focus:bg-blue-50 dark:focus:bg-blue-950">Cloud & DevOps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Project Details</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your project, timeline, and requirements..."
                      rows={5}
                      className="text-base border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={!user || loading}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                {user ? (
                  <button
                    type="submit"
                    form="contact-form"
                    disabled={loading}
                    className="w-full h-12 text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transition-all duration-300 ease-in-out dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    Send Message
                  </button>
                ) : (
                  <Button
                    asChild
                    size="lg"
                    className="w-full h-12 text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transition-all duration-300 ease-in-out dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    <a href="/login">Log in to Send Message</a>
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