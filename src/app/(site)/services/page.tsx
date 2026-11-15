"use client";

import { Navbar1 } from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import {
  Code2, Megaphone, ShoppingCart, Headphones, Package,
  ServerCog, Brush, Zap, Send, CheckCircle2, ArrowRight
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
import { useRef, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch } from "@/lib/api/client";
import Image from 'next/image';
import Script from "next/script";

// --- SEO Structured Data ---
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "IT & Digital Solutions",
  provider: {
    "@type": "Organization",
    name: "Danamo Tech Hub",
    url: "https://www.danamo-tech.co.ke",
    logo: "https://www.danamo-tech.co.ke/logo.png",
  },
  areaServed: {
    "@type": "Place",
    name: "Kenya",
  },
  offers: [
    { "@type": "Offer", name: "Custom Web Development" },
    { "@type": "Offer", name: "Search Engine Optimisation" },
    { "@type": "Offer", name: "Branding & UI/UX Design" },
    { "@type": "Offer", name: "Social Media & Digital Marketing" },
    { "@type": "Offer", name: "E-Commerce Solutions" },
    { "@type": "Offer", name: "IT Consulting & Support" },
    { "@type": "Offer", name: "SaaS Product Development" },
    { "@type": "Offer", name: "Cloud & DevOps" },
  ]
};

const services = [
  {
    title: "Custom Web Development",
    desc: "Tailored websites and web apps to meet your unique business needs.",
    value: "Web Development",
    icon: <Code2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "Search Engine Optimisation",
    desc: "Improve your online visibility and drive organic traffic with SEO best practices.",
    value: "SEO",
    icon: <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "Branding & UI/UX Design",
    desc: "Designing digital experiences that resonate with your brand and audience.",
    value: "Branding",
    icon: <Brush className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "Social Media & Digital Marketing",
    desc: "Strategic content and marketing to grow your online presence and engagement.",
    value: "Marketing",
    icon: <Megaphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "E-Commerce Solutions",
    desc: "Robust online stores with secure checkout and smooth user experience.",
    value: "E-Commerce",
    icon: <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "IT Consulting & Support",
    desc: "Expert advice and hands-on support to keep your IT systems running smoothly.",
    value: "Consulting",
    icon: <Headphones className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "SaaS Product Development",
    desc: "Build scalable SaaS platforms from MVP to full product lifecycle.",
    value: "SaaS",
    icon: <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "Cloud & DevOps",
    desc: "CI/CD implementation, serverless architecture, and cloud hosting solutions.",
    value: "Cloud",
    icon: <ServerCog className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
  },
];

export default function ServicesPage() {
  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [message, setMessage] = useState("");
  const { user, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Preserve original behavior: `loading` covered both auth-check AND submit
  const loading = authLoading || submitting;

  const handleCardClick = (value: string) => {
    setSelectedService(value);
    formSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    if (!user) {
      setError("Please log in to submit the form.");
      setSubmitting(false);
      return;
    }

    if (!name || !email || !selectedService || !message) {
      setError("All fields are required.");
      setSubmitting(false);
      return;
    }

    try {
      await apiFetch("/service-inquiries", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          service_slug: selectedService,
          message,
          company: null,
        }),
      });
      setSuccess("Message sent successfully! Our team will get back to you shortly.");
      setName("");
      setEmail("");
      setSelectedService("");
      setMessage("");
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
      <Navbar1 />
      
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section
          className="relative h-[50vh] md:h-[60vh] w-full flex items-center justify-center text-center px-4 overflow-hidden"
          aria-label="Our Services Overview"
        >
          <div className="absolute inset-0">
            <Image
              src="/services-page/service.jpg"
              alt="Danamo Tech Services - Hero Background"
              fill
              className="object-cover object-center"
              priority
              quality={85}
            />
            <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
          </div>
          <div className="relative z-10 max-w-4xl px-4">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
              Enterprise Solutions
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">
              Our <span className="text-blue-500">Services</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              Explore how Danamo Tech Hub can accelerate your business growth with scalable digital infrastructure.
            </p>
          </div>
        </section>

        {/* SERVICES CARDS */}
        <section
          className="py-24 px-4 md:px-8 max-w-[85rem] mx-auto"
          aria-label="List of Services"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What We Do Best
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Select a service below to start an inquiry. Our team is ready to help you build, scale, and innovate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <article
                key={idx}
                onClick={() => handleCardClick(service.value)}
                className="group relative cursor-pointer bg-white dark:bg-[#1E1E2F] rounded-2xl p-8 flex flex-col items-start gap-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {service.desc}
                  </p>
                </div>
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-blue-600 dark:bg-blue-400 transition-all duration-500 group-hover:w-full rounded-b-2xl" />
              </article>
            ))}
          </div>
        </section>

        {/* INQUIRY FORM SECTION */}
        <section 
          ref={formSectionRef} 
          className="py-24 bg-gray-100 dark:bg-[#0e0e15] transition-colors duration-700 scroll-mt-20"
        >
          <div className="layout w-full max-w-[85rem] mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Side Text */}
              <div className="flex flex-col items-start">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Ready to start your project?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-lg">
                  Tell us about your goals and challenges. We&apos;ll review your inquiry and get back to you within 24 hours with a tailored strategy.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Free initial consultation",
                    "Dedicated project manager",
                    "Transparent, milestone-based pricing"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="p-6 rounded-2xl bg-white dark:bg-[#1E1E2F] border border-gray-200 dark:border-gray-800 shadow-sm w-full max-w-md">
                   <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Prefer to email us directly?</p>
                   <a href="mailto:danamotech@gmail.com" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-2">
                     danamotech@gmail.com <ArrowRight className="w-4 h-4" />
                   </a>
                </div>
              </div>

              {/* Right Side Form */}
              <div className="w-full">
                <Card className="w-full rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1E1E2F] shadow-2xl shadow-blue-500/5">
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
                    <form id="service-form" onSubmit={handleSubmit} className="grid w-full gap-5">
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">Name</Label>
                        <Input
                          id="name"
                          placeholder="Your full name"
                          className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-12"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={!user || loading}
                          required
                        />
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">Email</Label>
                        <Input
                          type="email"
                          id="email"
                          placeholder="you@example.com"
                          className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-12"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={!user || loading}
                          required
                        />
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="interest" className="text-gray-700 dark:text-gray-300 font-medium">I am interested in...</Label>
                        <Select
                          value={selectedService}
                          onValueChange={(value) => setSelectedService(value)}
                          disabled={!user || loading}
                        >
                          <SelectTrigger id="interest" className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-12">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-[#1E1E2F] rounded-xl border-gray-200 dark:border-gray-700">
                            {services.map((service, idx) => (
                              <SelectItem key={idx} value={service.value}>{service.title}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="message" className="text-gray-700 dark:text-gray-300 font-medium">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us more about your project..."
                          rows={5}
                          className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 resize-none"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          disabled={!user || loading}
                          required
                        />
                      </div>

                      <CardFooter className="flex justify-end p-0 pt-4">
                        {user ? (
                          <Button
                            asChild
                            className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-600/20 text-base px-8 py-6 rounded-xl"
                          >
                            <button type="submit" form="service-form" disabled={loading}>
                              <Send size={18} className={`mr-2 ${loading ? "animate-pulse" : ""}`} />
                              {loading ? "Sending..." : "Send Inquiry"}
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
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* SEO Structured Data - Fixed React Warning */}
      <Script
        id="services-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
} 