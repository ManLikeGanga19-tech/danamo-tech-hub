'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare, Search, ShieldCheck, Wallet, Wrench, Zap, ChevronDown, HelpCircle } from 'lucide-react';
import { Navbar1 } from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const helpCategories = [
  {
    title: 'Getting Started',
    icon: <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    description: 'Learn how to set up your account and get going quickly.',
  },
  {
    title: 'Account & Security',
    icon: <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    description: 'Manage your password, privacy settings, and more.',
  },
  {
    title: 'Plans & Billing',
    icon: <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    description: 'Understand pricing, billing, invoices, and upgrades.',
  },
  {
    title: 'Technical Support',
    icon: <Wrench className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    description: 'Get help with technical issues or error messages.',
  },
  {
    title: 'Products & Features',
    icon: <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    description: 'Guides and tutorials for using our tools and features.',
  },
  {
    title: 'Announcements',
    icon: <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    description: 'Stay updated with platform changes and news.',
  },
];

const faqData = [
  {
    question: 'Can you redesign an existing website or app?',
    answer:
      'Absolutely. We offer redesign services to improve the performance, user experience, and aesthetics of your current website or application, ensuring it aligns with the latest design trends and technologies.'
  },
  {
    question: 'What types of websites or apps can you build?',
    answer:
      'We build everything from simple landing pages and blogs to complex SaaS platforms, e-commerce stores, enterprise-grade applications, and fully responsive mobile apps. Each solution is customized to meet our client\'s specific needs.'
  },
  {
    question: 'How do I contact support?',
    answer: 'You can reach our support team via the contact form below or by emailing support@yourdomain.com.',
  },
  {
    question: 'Do you offer custom development or use templates?',
    answer:
      'We specialize in custom development tailored to your brand and business goals. While we can incorporate templates for rapid development upon request, our core focus remains on originality, performance, and user-centered design.'
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFAQs = faqData.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDropdown = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F] min-h-screen flex flex-col">
      <Navbar1 />

      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] w-full flex items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/helpcenter-bg.jpg"
            alt="Help Center Hero Background"
            fill
            className="object-cover object-center"
            priority
            quality={85}
          />
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
        </div>

        <div className="relative z-10 max-w-3xl px-4 w-full">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6 backdrop-blur-md">
            Support Center
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
            How can we <span className="text-blue-500">help you today?</span>
          </h1>
          <p className="text-lg text-gray-300 mb-10">
            Find answers, guides, and resources to help you use our platform effectively.
          </p>
          
          {/* Premium Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-xl bg-white/90 dark:bg-[#1E1E2F]/90 backdrop-blur-md border-white/20 dark:border-gray-700 text-gray-900 dark:text-white shadow-2xl text-base focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-4 md:px-8 max-w-[85rem] mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Browse by Topic</h2>
          <p className="text-gray-600 dark:text-gray-400">Select a category to find the help you need.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpCategories.map((cat, i) => (
            <Card key={i} className="group p-8 flex flex-col items-start gap-4 bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cat.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-gray-600 dark:text-gray-400 leading-relaxed">
                {cat.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-24 px-4 md:px-8 bg-gray-50 dark:bg-[#0e0e15] border-y border-gray-100 dark:border-gray-800 w-full">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2">
              <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              Frequently Asked Questions
            </h2>
          </div>
          
          {filteredFAQs.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12 bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-100 dark:border-gray-800">
              No results found for &quot;{searchQuery}&quot;
            </p>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((item, index) => {
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
                        {item.question}
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
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Corporate Contact Support Section */}
      <section className="py-24 px-4 md:px-8 max-w-[85rem] mx-auto w-full text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Still Need Help?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
            If you can&apos;t find what you&apos;re looking for, our support team is ready to assist you.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300 shadow-lg shadow-green-500/20 text-base px-8 py-6 rounded-xl group"
          >
            <a
              href="https://wa.me/+254785640048"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              {/* WhatsApp Official SVG Logo */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6 group-hover:scale-110 transition-transform"
              >
                <path d="M12.04 2.004a9.998 9.998 0 00-8.49 14.987L2 22l5.126-1.494a9.998 9.998 0 004.914 1.276h.005a9.998 9.998 0 000-19.997zm0 2a8 8 0 018 8 7.97 7.97 0 01-1.365 4.495l.923 2.701-2.76-.894A8 8 0 014 12a8 8 0 018-8zm3.89 11.544c-.22-.11-1.29-.635-1.49-.71-.2-.08-.35-.11-.5.11-.15.22-.57.71-.7.86-.13.15-.26.17-.48.06a6.46 6.46 0 01-1.9-1.17 7.03 7.03 0 01-1.3-1.61c-.14-.24-.02-.37.1-.49.11-.11.24-.28.37-.42.12-.14.16-.24.25-.4.08-.16.04-.3-.01-.42-.05-.11-.5-1.2-.68-1.65-.18-.43-.37-.37-.5-.38h-.43c-.15 0-.4.06-.61.28-.21.23-.8.78-.8 1.89 0 1.11.82 2.19.93 2.34.11.15 1.61 2.45 3.91 3.34.55.24.98.38 1.31.48.55.18 1.05.15 1.44.09.44-.07 1.29-.52 1.47-1.03.18-.52.18-.96.13-1.05-.06-.09-.2-.15-.42-.26z" />
              </svg>
              Chat with Support on WhatsApp
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}