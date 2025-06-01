'use client';
import { Navbar1 } from "@/components/navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import {
  Code2,
  Megaphone,
  ShoppingCart,
  Headphones,
  Package,
  ServerCog,
  Brush,
  Zap,
  Send
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

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
  const form = useRef<HTMLFormElement | null>(null);
  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const [selectedService, setSelectedService] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCardClick = (value: string) => {
    setSelectedService(value);
    // Smooth scroll to form section
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!form.current) return;

    emailjs.sendForm(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT!,
      form.current,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    )
      .then(() => {
        alert('Message sent successfully!');
        form.current?.reset();
        setSelectedService(""); // Reset select
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        alert('Failed to send message. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F7] dark:bg-[#1E1E2F] text-[#333] dark:text-[#E5E7EB]">
      <Navbar1 />
      <main className="flex-grow p-6 md:p-12">
        <section
          className="max-w-6xl mx-auto text-center mb-16 relative bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/services-page/service.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 py-20 px-6">
            <h1 className="text-4xl font-bold mb-4 text-blue-600">
              Our <span className="text-white dark:text-white">Services</span>
            </h1>
            <p className="text-gray-200">
              Explore what Danamo Tech Hub can do for your business
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {services.map((service, idx) => (
            <div
              key={idx}
              onClick={() => handleCardClick(service.value)}
              className="cursor-pointer bg-white dark:bg-[#1E1E2F] rounded-2xl shadow-md p-6 flex flex-col items-start gap-4 hover:shadow-xl hover:ring-2 hover:ring-blue-500 transition duration-300"
            >
              {service.icon}
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="text-[#6B7280] dark:text-[#9CA3AF]">{service.desc}</p>
            </div>
          ))}
        </section>

        {/* FORM SECTION */}
        <div ref={formSectionRef} className="flex justify-center scroll-mt-24">
          <Card className="w-full max-w-md border-blue-400">
            <CardHeader>
              <CardDescription>
                Fill out the form and we will get back to you shortly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form ref={form} onSubmit={sendEmail} className="grid w-full gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name" className="text-blue-600 dark:text-blue-400">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="user_name"
                    placeholder="Your full name"
                    className="placeholder:text-gray-900 dark:placeholder:text-white"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email" className="text-blue-600 dark:text-blue-400">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="user_email"
                    placeholder="you@example.com"
                    className="placeholder:text-gray-900 dark:placeholder:text-white"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="interest" className="text-blue-600 dark:text-blue-400">
                    I am interested in...
                  </Label>
                  <Select value={selectedService} onValueChange={(value) => setSelectedService(value)}>
                    <SelectTrigger id="interest">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-100 dark:text-white dark:bg-[#1E1E2F]">
                      {services.map((service, idx) => (
                        <SelectItem key={idx} value={service.value}>
                          {service.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="service" value={selectedService} />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="message" className="text-blue-600 dark:text-blue-400">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about your project..."
                    rows={4}
                    className="placeholder:text-gray-900 dark:placeholder:text-white"
                    required
                  />
                </div>

                <CardFooter className="flex justify-end p-0 pt-2">
                  <Button
                    {...({
                      type: "submit",
                      disabled: loading,
                    } as React.ButtonHTMLAttributes<HTMLButtonElement>)}
                    className="bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600"
                  >
                    <Send size={12} className="animate-pulse mr-2" />
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
