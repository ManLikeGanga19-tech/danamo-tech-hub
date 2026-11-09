'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Navbar1 } from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'What is Danamo Tech Hub and what services do you offer?',
    answer:
      'Danamo Tech Hub is a cutting-edge technology company that offers a wide range of services including web and app development, search engine optimization, branding and UI/UX design, digital marketing, e-commerce solutions, IT consulting, SaaS development, and cloud & DevOps solutions. Our goal is to help businesses thrive online with modern, scalable, and secure digital solutions.'
  },
  {
    question: 'Where is your team based? Do you work with international clients?',
    answer:
      'Our team is globally distributed with core members based in Africa and Europe. We proudly serve international clients and have experience working across various time zones, ensuring seamless collaboration no matter your location.'
  },
  {
    question: 'What types of websites or apps can you build?',
    answer:
      'We build everything from simple landing pages and blogs to complex SaaS platforms, e-commerce stores, enterprise-grade applications, and fully responsive mobile apps. Each solution is customized to meet our client’s specific needs.'
  },
  {
    question: 'Do you offer custom development or use templates?',
    answer:
      'We specialize in custom development tailored to your brand and business goals. While we can incorporate templates for rapid development upon request, our core focus remains on originality, performance, and user-centered design.'
  },
  {
    question: 'Can you redesign an existing website or app?',
    answer:
      'Absolutely. We offer redesign services to improve the performance, user experience, and aesthetics of your current website or application, ensuring it aligns with the latest design trends and technologies.'
  },
  {
    question: 'How much does a typical project cost?',
    answer:
      'Project pricing depends on the scope, complexity, and timeline. We provide transparent quotes after understanding your specific requirements. Our pricing is competitive, and we focus on delivering exceptional value for your investment.'
  },
  {
    question: 'Do you offer fixed pricing or hourly billing?',
    answer:
      'We offer both fixed-price packages and hourly billing depending on the nature of the project. This flexibility allows clients to choose what works best for their budget and scope.'
  },
  {
    question: 'Are there any hidden fees after the project starts?',
    answer:
      'No, we maintain transparency in our pricing. Any potential additional costs are discussed upfront and approved by you before implementation.'
  },
  {
    question: 'How long does it take to complete a project?',
    answer:
      'Timelines vary based on the project’s size and requirements. On average, small websites may take 2-4 weeks, while larger web apps can take 2-3 months. We provide a timeline estimate during the planning phase and keep you updated throughout development.'
  },
  {
    question: 'What is your development process like?',
    answer:
      'Our process includes discovery and planning, design prototyping, development, testing, deployment, and post-launch support. We involve you in every step to ensure the result aligns with your vision.'
  },
  {
    question: 'How involved will I be during the project?',
    answer:
      'Your input is essential to our success. We maintain open communication throughout the project and provide opportunities for feedback at every major stage to ensure alignment with your expectations.'
  },
  {
    question: 'Do you offer ongoing support after launch?',
    answer:
      'Yes, we provide various support and maintenance packages after launch to ensure your product remains secure, up-to-date, and functional. We’re here for the long run.'
  },
  {
    question: 'Can I update my website/app myself?',
    answer:
      'Yes, we build user-friendly admin dashboards or content management systems (CMS) that allow you to make changes easily. We also offer training if needed.'
  },
  {
    question: 'What if something breaks after the project is done?',
    answer:
      'We stand by the quality of our work. If any issues arise, we offer a warranty period post-launch and are always available to help resolve problems quickly and professionally.'
  },
  {
    question: 'How do you ensure data security in your apps?',
    answer:
      'We follow industry best practices including data encryption, secure authentication, authorization layers, regular security audits, and compliance with data privacy laws. Security is a top priority in everything we build.'
  },
  {
    question: 'Do you comply with data protection laws like GDPR?',
    answer:
      'Yes, we are committed to data privacy and ensure compliance with laws such as GDPR and other local data protection regulations relevant to our clients’ regions.'
  },
  {
    question: 'What technologies do you use?',
    answer:
      'We use modern technologies such as React, Next.js, Tailwind CSS, Node.js, FastAPI, PostgreSQL, Supabase, Firebase, and various DevOps tools depending on the project’s requirements.'
  },
  {
    question: 'Do you build SEO-optimized and mobile-responsive websites?',
    answer:
      'Absolutely. Every website we develop is SEO-friendly and optimized for all screen sizes, ensuring high performance, accessibility, and visibility across devices and search engines.'
  },
  {
    question: 'How can I request a quote or start a project?',
    answer:
      'You can reach out to us via our Contact page, send us an email, or schedule a call. We’ll discuss your needs and prepare a tailored proposal to get things moving.'
  },
  {
    question: 'What do I need to provide before you start development?',
    answer:
      'We’ll need your business goals, branding materials (if available), any reference websites, content outlines, and technical requirements. Don’t worry — we guide you through it step-by-step.'
  }
];

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default first item open

  const toggleDropdown = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F] text-foreground min-h-screen flex flex-col">
      <Navbar1 />

      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] w-full flex items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/faqs-bg.jpg"
            alt="FAQ Background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
        </div>
        <div className="relative z-10 max-w-3xl px-4">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6 backdrop-blur-md">
            Support Center
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
            Frequently Asked <span className="text-blue-500">Questions</span>
          </h1>
          <p className="text-lg text-gray-300">
            Answers to common questions about our services, process, and platform.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <main className="flex-grow px-4 md:px-8 py-24">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              How can we help you?
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <Card
                  key={index}
                  className={`overflow-hidden border transition-all duration-300 rounded-2xl ${
                    isOpen
                      ? 'border-blue-600 dark:border-blue-500 shadow-lg shadow-blue-500/5 bg-white dark:bg-[#1E1E2F]'
                      : 'border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 bg-white/60 dark:bg-[#1E1E2F]/60 backdrop-blur-sm'
                  }`}
                >
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="w-full flex justify-between items-center px-6 py-5 text-left transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className={`text-lg font-semibold pr-4 ${isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                      {faq.question}
                    </span>
                    <div className={`flex-none flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isOpen ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={18} />
                      </motion.div>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FaqPage;