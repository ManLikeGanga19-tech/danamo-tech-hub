'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Mail, MessageSquare, Search, ShieldCheck, Wallet, Wrench, Zap } from 'lucide-react';
import { Navbar1 } from '@/components/navbar/Navbar';
import Footer from '@/components/Footer/Footer';

const helpCategories = [
  {
    title: 'Getting Started',
    icon: <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-pulse" />,
    description: 'Learn how to set up your account and get going quickly.',
  },
  {
    title: 'Account & Security',
    icon: <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-pulse " />,
    description: 'Manage your password, privacy settings, and more.',
  },
  {
    title: 'Plans & Billing',
    icon: <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-pulse" />,
    description: 'Understand pricing, billing, invoices, and upgrades.',
  },
  {
    title: 'Technical Support',
    icon: <Wrench className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-pulse" />,
    description: 'Get help with technical issues or error messages.',
  },
  {
    title: 'Products & Features',
    icon: <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-pulse" />,
    description: 'Guides and tutorials for using our tools and features.',
  },
  {
    title: 'Announcements',
    icon: <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-pulse" />,
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
      'We build everything from simple landing pages and blogs to complex SaaS platforms, e-commerce stores, enterprise-grade applications, and fully responsive mobile apps. Each solution is customized to meet our client’s specific needs.'
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

  const filteredFAQs = faqData.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-b from-white to-gray-100 dark:from-[#1E1E2F]  dark:to-[#0e0e15]">
      <Navbar1 />

      {/* Hero Section */}
      <section
        className="py-20 px-4 md:px-16 text-center bg-[url('/helpcenter-bg.jpg')] bg-cover bg-center bg-no-repeat relative"
      >
        {/* Overlay to preserve dark/light gradient */}
        <div className="absolute inset-0 bg-black/40 opacity-90 backdrop-blur-sm"></div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-blue-500 dark:text-blue-400">How can we help you today?</h1>
          <p className="text-lg mb-6 text-gray-100">
            Find answers, guides, and resources to help you use our platform effectively.
          </p>
          <div className="max-w-xl mx-auto flex items-center gap-2 relative">
            <Search className="absolute ml-3 text-gray-500 w-5 h-5" />
            <Input
              placeholder="Search help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-2 rounded-lg w-full bg-white dark:bg-[#1E1E2F] border border-gray-300 dark:border-gray-700"
            />
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 px-4 md:px-16 max-w-4xl mx-auto ">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Frequently Asked Questions</h2>
        {filteredFAQs.length === 0 ? (
          <p className="text-center text-muted-foreground dark:text-gray-400">No results found for "{searchQuery}"</p>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {filteredFAQs.map((item, index) => (
              <AccordionItem key={index} value={`faq-${index}`} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 text-left text-lg font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2A2A3C]">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-sm text-muted-foreground dark:text-gray-300 animate-slide-down">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </section>
      {/* Categories Section */}
      <section className="py-16 px-4 md:px-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Browse by Topic</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpCategories.map((cat, i) => (
            <Card key={i} className="p-6 flex flex-col items-start gap-4 shadow-md dark:bg-[#1E1E2F]">
              {cat.icon}
              <CardHeader className="p-0">
                <CardTitle>{cat.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-sm text-muted-foreground dark:text-gray-400">
                {cat.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>



      {/* Contact Support Section */}
      <section className="py-20 px-4 md:px-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
        <p className="mb-6">
          If you can&apos;t find what you&apos;re looking for, our support team is ready to assist you.
        </p>
        <a
          href="https://wa.me/YOUR_WHATSAPP_NUMBER"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center p-3 rounded-full bg-green-500 hover:bg-green-600 transition animate-pulse"
          aria-label="Contact Support on WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            width="32"
            height="32"
          >
            <path d="M12.04 2.004a9.998 9.998 0 00-8.49 14.987L2 22l5.126-1.494a9.998 9.998 0 004.914 1.276h.005a9.998 9.998 0 000-19.997zm0 2a8 8 0 018 8 7.97 7.97 0 01-1.365 4.495l.923 2.701-2.76-.894A8 8 0 014 12a8 8 0 018-8zm3.89 11.544c-.22-.11-1.29-.635-1.49-.71-.2-.08-.35-.11-.5.11-.15.22-.57.71-.7.86-.13.15-.26.17-.48.06a6.46 6.46 0 01-1.9-1.17 7.03 7.03 0 01-1.3-1.61c-.14-.24-.02-.37.1-.49.11-.11.24-.28.37-.42.12-.14.16-.24.25-.4.08-.16.04-.3-.01-.42-.05-.11-.5-1.2-.68-1.65-.18-.43-.37-.37-.5-.38h-.43c-.15 0-.4.06-.61.28-.21.23-.8.78-.8 1.89 0 1.11.82 2.19.93 2.34.11.15 1.61 2.45 3.91 3.34.55.24.98.38 1.31.48.55.18 1.05.15 1.44.09.44-.07 1.29-.52 1.47-1.03.18-.52.18-.96.13-1.05-.06-.09-.2-.15-.42-.26z" />
          </svg>
        </a>
      </section>

      <Footer />
    </div>
  );
}
