"use client";

import { Navbar1 } from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import {
  Code2, Megaphone, ShoppingCart, Headphones, Package,
  ServerCog, Brush, Zap, Send
} from "lucide-react";
import {
  Card, CardHeader, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState, useEffect } from "react";
import { account, appwriteClient } from "@/lib/appwriteServices";
import { Models, Databases, ID } from "appwrite";
import Image from 'next/image';
import ProtectedRoute from "@/components/ProtectedRoute";

const services = [
  {
    title: "Custom Web Development",
    desc: "Tailored websites and web apps to meet your unique business needs.",
    value: "Web Development",
    icon: <Code2 className="h-6 w-6 text-primary dark:text-blue-400" />,
  },
  {
    title: "Search Engine Optimisation",
    desc: "Improve your online visibility and drive organic traffic with SEO best practices.",
    value: "SEO",
    icon: <Zap className="h-6 w-6 text-primary dark:text-blue-400" />,
  },
  {
    title: "Branding & UI/UX Design",
    desc: "Designing digital experiences that resonate with your brand and audience.",
    value: "Branding",
    icon: <Brush className="h-6 w-6 text-primary dark:text-blue-400" />,
  },
  {
    title: "Social Media & Digital Marketing",
    desc: "Strategic content and marketing to grow your online presence and engagement.",
    value: "Marketing",
    icon: <Megaphone className="h-6 w-6 text-primary dark:text-blue-400" />,
  },
  {
    title: "E-Commerce Solutions",
    desc: "Robust online stores with secure checkout and smooth user experience.",
    value: "E-Commerce",
    icon: <ShoppingCart className="h-6 w-6 text-primary dark:text-blue-400" />,
  },
  {
    title: "IT Consulting & Support",
    desc: "Expert advice and hands-on support to keep your IT systems running smoothly.",
    value: "Consulting",
    icon: <Headphones className="h-6 w-6 text-primary dark:text-blue-400" />,
  },
  {
    title: "SaaS Product Development",
    desc: "Build scalable SaaS platforms from MVP to full product lifecycle.",
    value: "SaaS",
    icon: <Package className="h-6 w-6 text-primary dark:text-blue-400" />,
  },
  {
    title: "Cloud & DevOps",
    desc: "CI/CD implementation, serverless architecture, and cloud hosting solutions.",
    value: "Cloud",
    icon: <ServerCog className="h-6 w-6 text-primary dark:text-blue-400" />,
  },
];

export default function ServicesPage() {
  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if user is logged in
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

  const handleCardClick = (value: string) => {
    setSelectedService(value);
    formSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!user) {
      setError("Please log in to submit the form.");
      setLoading(false);
      return;
    }

    if (!name || !email || !selectedService || !message) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const databases = new Databases(appwriteClient);
      await databases.createDocument(
        "6840196a001ea51cd944", // appwrite Database ID
        "6840913f00128df299b6", // servicesCollection ID
        ID.unique(),
        {
          userID: user.$id,
          name,
          email,
          service: selectedService,
          message,
          createdAt: new Date().toISOString(),
        }
      );
      setSuccess("Message sent successfully!");
      setName("");
      setEmail("");
      setSelectedService("");
      setMessage("");
    } catch (err: unknown) {
      console.error("Appwrite database error:", JSON.stringify(err, null, 2));
      const errorMessage = err instanceof Error ? err.message : "Failed to send message.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-[#1E1E2F] dark:to-[#0e0e15]">
        <Navbar1 />
        <main className="flex-grow">
          {/* HERO SECTION */}
          <section className="relative h-[60vh] w-full flex items-center justify-center">
            <div className="absolute inset-0">
              <Image
                src="/services-page/service.jpg"
                alt="Services Hero Background"
                fill
                className="object-cover object-center"
                priority
                quality={85}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
            <div className="relative z-10 text-center px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-500">
                Our <span className="text-white">Services</span>
              </h1>
              <p className="text-gray-200 text-lg md:text-xl">
                Explore what Danamo Tech Hub can do for your business
              </p>
            </div>
          </section>

          {/* SERVICES CARDS */}
          <section className="p-6 md:p-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {services.map((service, idx) => (
              <div
                key={idx}
                onClick={() => handleCardClick(service.value)}
                className="cursor-pointer bg-white dark:bg-[#1E1E2F] rounded-2xl shadow-md p-6 flex flex-col items-start gap-4 hover:shadow-xl hover:ring-2 hover:ring-blue-500 transition duration-300"
              >
                {service.icon}
                <h3 className="text-xl font-semibold text-blue-600 dark:text-white">
                  {service.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-400">{service.desc}</p>
              </div>
            ))}
          </section>

          {/* CONTACT FORM */}
          <div ref={formSectionRef} className="flex justify-center scroll-mt-24 px-4">
            <Card className="w-full max-w-md border-blue-400">
              <CardHeader>
                <CardDescription>
                  {loading ? "Checking login status..." : user ? "Fill out the form and we will get back to you shortly." : "Please log in to send a message."}
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
                <form id="service-form" onSubmit={handleSubmit} className="grid w-full gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name" className="text-blue-600 dark:text-blue-400">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      className="placeholder:text-gray-900 dark:placeholder:text-white"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!user || loading}
                      required
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
                      disabled={!user || loading}
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="interest" className="text-blue-600 dark:text-blue-400">I am interested in...</Label>
                    <Select
                      value={selectedService}
                      onValueChange={(value) => setSelectedService(value)}
                      disabled={!user || loading}
                    >
                      <SelectTrigger id="interest">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-100 dark:text-white dark:bg-[#1E1E2F]">
                        {services.map((service, idx) => (
                          <SelectItem key={idx} value={service.value}>{service.title}</SelectItem>
                        ))}
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
                      disabled={!user || loading}
                      required
                    />
                  </div>

                  <CardFooter className="flex justify-end p-0 pt-2">
                    {user ? (
                      <Button
                        asChild
                        className="bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600"
                      >
                        <button type="submit" form="service-form" disabled={loading}>
                          <Send size={12} className="animate-pulse mr-2" />
                          {loading ? "Sending..." : "Send Message"}
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
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}