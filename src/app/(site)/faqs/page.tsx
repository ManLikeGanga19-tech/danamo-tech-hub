'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Navbar1 } from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { faqs } from './data';


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
          <div className="absolute inset-0 hero-scrim" />
        </div>
        <div className="relative z-10 max-w-3xl px-4">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6 backdrop-blur-md">
            Support Center
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
            Frequently Asked <span className="text-blue-500">Questions</span>
          </h1>
          <p className="text-lg text-gray-100">
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
                    <div className={`flex-none flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isOpen ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'}`}>
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
                        <div className="px-6 pb-6 pt-0 text-gray-700 dark:text-gray-300 leading-relaxed">
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