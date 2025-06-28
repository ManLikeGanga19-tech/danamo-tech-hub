"use client";

import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/button"

const AboutUs = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const fullText =
        "Danamo Tech is a privately owned company headquartered in Nairobi, Kenya. Founded in 2024, the company was established to bridge the technology gap faced by small businesses and startups in need of affordable digital solutions. We specialize in providing high-quality web development, search engine optimization (SEO), branding, digital marketing, and custom software solutions for businesses and startups.";

    return (
        <section
            ref={sectionRef}
            className="relative w-full py-16 sm:py-20 lg:py-24 transition-colors duration-700 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950/20 overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"></div>
            <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        About{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                            Us
                        </span>
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
                    {/* Image */}
                    <div className="w-full lg:w-1/2 max-w-lg">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-20 transform -rotate-6"></div>
                            <Image
                                src="/about.jpg"
                                alt="About Danamo Tech - Our team and workspace"
                                width={600}
                                height={600}
                                className="relative z-10 rounded-2xl shadow-2xl w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
                                priority
                            />
                        </div>
                    </div>

                    {/* Text Section */}
                    <div className="w-full lg:w-1/2 max-w-2xl space-y-8">
                        <div className="space-y-6">
                            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                                {fullText}
                            </p>
                            
                            {/* Key highlights */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                                <div className="flex items-center gap-3 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">Founded 2024</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">Nairobi Based</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">50+ Projects</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">Global Reach</span>
                                </div>
                            </div>
                        </div>

                        {/* Call to action buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <Button
                                asChild
                                size="lg"
                                className="w-full sm:w-auto px-8 py-4 text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out dark:bg-blue-500 dark:hover:bg-blue-600"
                            >
                                <a href="/about">Learn More About Us</a>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto px-8 py-4 text-base font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white"
                            >
                                <a href="/team">Meet Our Team</a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
