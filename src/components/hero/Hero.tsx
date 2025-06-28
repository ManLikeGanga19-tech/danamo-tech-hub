"use client";

import Image from "next/image";
import heroImg from "../../../public/hero-img.jpg";
import { Button } from "@/components/ui/button";

const Hero = () => {
    return (
        <section
            className="relative w-full py-16 sm:py-20 lg:py-24 transition-colors duration-700 bg-gradient-to-br from-white via-blue-50/30 to-gray-100 dark:from-gray-900 dark:via-blue-950/20 dark:to-gray-800 overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"></div>
            <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            <div className="layout flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 relative z-10">
                {/* Left Side: Text Content */}
                <div className="text-center lg:text-left max-w-2xl space-y-6">
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                            Empowering Digital Innovation with{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                Danamo Tech
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
                            We build scalable web applications, design modern interfaces, and deliver
                            top-notch DevOps solutions for startups and enterprises worldwide.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 max-sm:justify-center pt-4">
                        <Button
                            asChild
                            size="lg"
                            className="w-full sm:w-auto px-8 py-4 text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                            <a href="/services">Get Started</a>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto px-8 py-4 text-base font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white"
                        >
                            <a href="/about">Learn More</a>
                        </Button>
                    </div>
                    
                    {/* Stats or features */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-8 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>50+ Projects Delivered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span>24/7 Support</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                            <span>99% Client Satisfaction</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Hero Image */}
                <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl relative">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-20 transform rotate-6"></div>
                        <Image
                            src={heroImg}
                            alt="Hero image showcasing digital innovation"
                            className="relative z-10 w-full h-auto object-contain rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                            priority
                            placeholder="blur"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;