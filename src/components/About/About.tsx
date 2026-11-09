"use client";

import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react";

const AboutUs = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const fullText =
        "Danamo Tech is a privately owned company headquartered in Mombasa, Kenya founded in 2024, the company was established to bridge the technology gap faced by small businesses and startups in need of affordable digital solutions.";

    const specializations = [
        "Web Development",
        "Search Engine Optimization (SEO)",
        "Branding & UI/UX",
        "Digital Marketing",
        "Custom Software Solutions"
    ];

    return (
        <section
            ref={sectionRef}
            className="w-full py-24 transition-colors duration-700 bg-gradient-to-b from-white to-gray-50 dark:from-[#1E1E2F] dark:to-[#0e0e15] overflow-hidden"
        >
            {/* Matched the max-width exactly to the Hero section (85rem) */}
            <div className="layout w-full max-w-[85rem] mx-auto px-4 md:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white">
                        About <span className="text-blue-600 dark:text-blue-400">Us</span>
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
                    
                    {/* Image Section */}
                    <div className="w-full lg:w-1/2 relative">
                        {/* Elegant offset border instead of AI floating badge */}
                        <div className="absolute inset-0 bg-blue-600/10 dark:bg-blue-500/10 rounded-2xl transform translate-x-4 translate-y-4 -z-10" />
                        
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800">
                            <Image
                                src="/about.jpg"
                                alt="Danamo Tech Team"
                                width={800}
                                height={800}
                                className="w-full h-auto object-cover aspect-square lg:aspect-[4/3]"
                                priority
                            />
                        </div>
                        
                        {/* Subtle text tag integrated into the image layout */}
                        <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-[#0e0e15]/90 backdrop-blur-md px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide uppercase">
                                Mombasa, Kenya
                            </p>
                        </div>
                    </div>

                    {/* Text Section */}
                    <div className="w-full lg:w-1/2 flex flex-col items-start">
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                            Bridging the technology gap for businesses and startups.
                        </h3>
                        
                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                            {fullText}
                        </p>

                        {/* Corporate Checklist derived from your text */}
                        <div className="mb-10 w-full">
                            <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                What we specialize in:
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {specializations.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50">
                                            <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Single, cleanly aligned button */}
                        <Button
                            asChild
                            size="lg"
                            className="px-8 py-6 rounded-xl bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white group shadow-sm"
                        >
                            <a href="/about" className="flex items-center gap-2">
                                Learn More About Us
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </Button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutUs;