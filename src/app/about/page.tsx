'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Navbar1 } from '@/components/navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function About() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const cards = [
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

  return (
    <div className="min-h-screen w-full">
      <Navbar1 />

      {/* Hero Section */}
      <section
        className="relative h-[60vh] w-full bg-cover bg-center flex items-center justify-center text-white text-center px-4"
        style={{ backgroundImage: 'url(/about-bg.jpg)' }}
      >
        <div className="bg-black/60 absolute inset-0 z-0"></div>
        <div className="z-10 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-500"> <span className='text-white'>About</span> Danamo Tech</h1>
          <p className="text-lg md:text-xl text-gray-200">
            Empowering Startups and Small Businesses with Smart Digital Solutions
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 px-6 md:px-24 bg-gradient-to-b from-white to-white dark:from-[#1E1E2F] dark:to-[#0e0e15]">
        <div className="max-w-4xl mx-auto space-y-8">
          {cards.map((card, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                onClick={() => setActiveIndex(isOpen ? null : index)}
                className="cursor-pointer p-6 border border-blue-500 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition duration-300 bg-white dark:bg-[#1E1E2F]"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {card.title}
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300">
                    {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: isOpen ? 1 : 0,
                    height: isOpen ? 'auto' : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden text-gray-700 dark:text-gray-300"
                >
                  <p>{card.content}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center py-12 bg-gradient-to-b from-white to-gray-100 dark:from-[#0e0e15]  dark:to-[#0e0e15]  ">
        <Button
          asChild
          size="lg"
          className="bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
        >
          <a href="/services">Explore Our Services</a>
        </Button>
      </div>

      <Footer />
    </div>
  );
}
