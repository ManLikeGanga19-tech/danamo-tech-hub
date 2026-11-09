'use client';

import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar1 = lazy(() =>
  import('@/components/Navbar/Navbar').then(module => ({
    default: module.Navbar1,
  }))
);

const Footer = lazy(() => import('@/components/Footer/Footer'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-blue-600 dark:text-blue-400">Loading...</div>
  </div>
);

// Corporate Content (Updated to Mombasa)
const CARDS = [
  {
    title: 'Who We Are',
    content:
      'Danamo Tech is a premier technology consultancy headquartered in Mombasa, Kenya. Founded in 2024, we are dedicated to bridging the digital divide for high-growth startups and SMEs by delivering secure, scalable, and enterprise-grade software solutions tailored to modern business challenges.',
  },
  {
    title: 'What Sets Us Apart',
    content:
      'We differentiate ourselves through a commitment to engineering excellence, agile delivery, and strategic partnership. By aligning our technical architecture with your business objectives, we deliver high-ROI solutions that scale seamlessly as your company grows. We prioritize transparency, security, and long-term success over quick fixes.',
  },
  {
    title: 'Our Vision',
    content:
      'Our vision is to emerge as a leading global technology partner, driving digital transformation across emerging markets and empowering the next generation of innovative businesses with world-class digital infrastructure.',
  },
];

const AccordionCard = React.memo(
  ({
    card,
    index,
    isOpen,
    onToggle,
  }: {
    card: typeof CARDS[0];
    index: number;
    isOpen: boolean;
    onToggle: (index: number) => void;
  }) => {
    const handleClick = useCallback(() => {
      onToggle(index);
    }, [index, onToggle]);

    return (
      <div
        onClick={handleClick}
        className={`group cursor-pointer p-6 md:p-8 border rounded-2xl transition-all duration-300 ${
          isOpen 
            ? 'border-blue-600 dark:border-blue-500 shadow-lg shadow-blue-500/10 bg-white dark:bg-[#1E1E2F]' 
            : 'border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 bg-white/60 dark:bg-[#1E1E2F]/60 backdrop-blur-sm'
        }`}
        role="button"
        aria-expanded={isOpen}
        aria-controls={`card-content-${index}`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className={`text-2xl font-bold transition-colors ${isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-gray-300 dark:text-gray-700'}`}>
              0{index + 1}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {card.title}
            </h2>
          </div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isOpen ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
              id={`card-content-${index}`}
            >
              <p className="pt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed pl-0 md:pl-12">
                {card.content}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

AccordionCard.displayName = 'AccordionCard';

export default function AboutClient() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const handleToggle = useCallback((index: number) => {
    setActiveIndex(current => (current === index ? null : index));
  }, []);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
        <Suspense fallback={<div className="h-16 bg-gray-200 animate-pulse" />}>
          <Navbar1 />
        </Suspense>

        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] w-full flex items-center justify-center text-center px-4 overflow-hidden">
          <Image
            src="/about-bg.jpg"
            alt="Danamo Tech corporate team"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="bg-black/60 absolute inset-0 z-0"></div>

          <div className="z-10 max-w-4xl relative px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">
              About <span className="text-blue-500">Danamo Tech</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Empowering Startups and Small Businesses with Enterprise-Grade Digital Solutions.
            </p>
          </div>
        </section>

        {/* Overview Section */}
        <section
          className="py-24 px-4 md:px-8 max-w-[85rem] mx-auto"
          aria-label="Company Overview"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Driving Digital Innovation
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We don&apos;t just write code; we build scalable infrastructure that drives your business forward.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {CARDS.map((card, index) => (
              <AccordionCard
                key={index}
                card={card}
                index={index}
                isOpen={activeIndex === index}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-b from-transparent to-gray-100 dark:to-[#1E1E2F]">
          <div className="text-center px-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to scale your business?
            </h3>
            <Button
              asChild
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-600/20 text-base px-8 py-6 rounded-xl"
            >
              <a href="/services" aria-label="Explore our services">
                Explore Our Services
              </a>
            </Button>
          </div>
        </section>

        <Suspense fallback={<div className="h-64 bg-gray-200 animate-pulse" />}>
          <Footer />
        </Suspense>
      </div>
    </Suspense>
  );
}