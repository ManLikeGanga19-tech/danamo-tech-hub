'use client';

import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

// Fixed lazy loading for named exports
const Navbar1 = lazy(() =>
  import('@/components/Navbar/Navbar').then(module => ({
    default: module.Navbar1
  }))
);

// const Footer = lazy(() =>
//   import('@/components/Footer/Footer').then(module => ({
//     default: module.Footer
//   }))
// );

// Alternative: If Footer is default export, this:
const Footer = lazy(() => import('@/components/Footer/Footer'));

// Lazy load Framer Motion with proper typing
const MotionDiv = lazy(() =>
  import('framer-motion').then(module => ({
    default: module.motion.div
  }))
);

// Import only the icons we need
import { ChevronDown, ChevronUp } from 'lucide-react';

// Loading component for suspense fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse">Loading...</div>
  </div>
);

// Memoize the card data to prevent unnecessary re-renders
const CARDS = [
  {
    title: 'Who We Are',
    content:
      'Danamo Tech is a privately owned company based in Nairobi, Kenya. Founded in 2024, the company was established to bridge the technology gap faced by small businesses and startups in need of affordable digital solutions.',
  },
  {
    title: 'What Sets Us Apart',
    content:
      'What sets Danamo Tech apart is our dedication to client-focused solutions, a clean and agile development process, and affordable pricing tailored for startups and small businesses. We prioritize long-term partnerships with our clients through transparency, speed, and quality service delivery.',
  },
  {
    title: 'Our Vision',
    content:
      'Our vision is to become a trusted global tech partner for startups and SMEs by continuously evolving with industry trends and exceeding client expectations.',
  },
];

// Memoized card component to prevent re-renders
const AccordionCard = React.memo(({
  card,
  index,
  isOpen,
  onToggle
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
      className="cursor-pointer p-6 border border-blue-500 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition duration-300 bg-white dark:bg-[#1E1E2F]"
      role="button"
      aria-expanded={isOpen}
      aria-controls={`card-content-${index}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
          {card.title}
        </h2>
        <div className="text-gray-700 dark:text-gray-300" aria-hidden="true">
          {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>

      <MotionDiv
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden text-gray-700 dark:text-gray-300"
        id={`card-content-${index}`}
      >
        <p>{card.content}</p>
      </MotionDiv>
    </div>
  );
});

AccordionCard.displayName = 'AccordionCard';

export default function About() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Memoize the toggle function
  const handleToggle = useCallback((index: number) => {
    setActiveIndex(current => current === index ? null : index);
  }, []);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="min-h-screen w-full">
        <Suspense fallback={<div className="h-16 bg-gray-200 animate-pulse" />}>
          <Navbar1 />
        </Suspense>

        {/* Hero Section - Optimized for SEO and LCP */}
        <section className="relative h-[60vh] w-full flex items-center justify-center text-white text-center px-4 overflow-hidden">
          {/* Next.js Image with priority for LCP */}
          <Image
            src="/about-bg.jpg"
            alt="About Danamo Tech - Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />

          {/* Dark overlay */}
          <div className="bg-black/60 absolute inset-0 z-0"></div>

          {/* Content */}
          <div className="z-10 max-w-3xl relative">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-500">
              <span className='text-white'>About</span> Danamo Tech
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Empowering Startups and Small Businesses with Smart Digital Solutions
            </p>
          </div>
        </section>

        {/* Overview Section */}
        <section
          className="py-16 px-6 md:px-24 bg-gradient-to-b from-white to-white dark:from-[#1E1E2F] dark:to-[#0e0e15]"
          role="main"
          aria-label="Company Overview"
        >
          <div className="max-w-4xl mx-auto space-y-8">
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

        {/* CTA Section */}
        <div
          className="text-center py-12 bg-gradient-to-b from-white to-gray-100 dark:from-[#0e0e15] dark:to-[#0e0e15]"
          role="complementary"
          aria-label="Call to Action"
        >
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
          >
            <a href="/services" aria-label="Explore our services">
              Explore Our Services
            </a>
          </Button>
        </div>

        <Suspense fallback={<div className="h-64 bg-gray-200 animate-pulse" />}>
          <Footer />
        </Suspense>
      </div>
    </Suspense>
  );
}