"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Static import so Next.js optimizes the image and generates the blur placeholder
import heroImage from "../../../public/hero-img.jpg";

const Hero = () => {
    return (
        <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden transition-colors duration-700 bg-gray-100 dark:bg-gray-900">
            
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={heroImage}
                    alt="Danamo Tech Digital Innovation"
                    fill
                    priority
                    placeholder="blur"
                    sizes="100vw"
                    className="object-cover object-center"
                />
                {/* Shade only behind the text (left on desktop) so the photo stays vivid;
                    on phones, where text covers the image, a lighter even tint. */}
                <div className="absolute inset-0 bg-white/55 dark:bg-black/55 lg:bg-transparent lg:dark:bg-transparent lg:bg-gradient-to-r lg:from-white/90 lg:via-white/55 lg:to-transparent lg:dark:from-black/85 lg:dark:via-black/50 lg:dark:to-transparent" />
                {/* Subtle bottom gradient to blend into next section */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-gray-50 dark:to-[#0e0e15]" />
            </div>

            {/* Content Container */}
            <div className="layout relative z-10 w-full max-w-[85rem] mx-auto px-4 md:px-8 py-24 flex flex-col items-center lg:items-start text-center lg:text-left">
                
                <div className="max-w-3xl">
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight text-gray-900 dark:text-white drop-shadow-sm">
                        Empowering Digital Innovation with{" "}
                        <span className="text-blue-700 dark:text-blue-400">
                            Danamo Tech
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-10 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                        A software development company in Mombasa, Kenya. We build custom
                        websites, web and mobile apps and M-Pesa integrated business systems
                        for startups, SMEs and schools.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                        <Button
                            asChild
                            size="lg"
                            className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-600/30 text-base px-8 py-6 rounded-xl"
                        >
                            <Link href="/services" className="flex items-center gap-2">
                                Get Started
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto 
                                bg-gray-900/5 dark:bg-white/10 
                                backdrop-blur-sm 
                                border-gray-900/20 dark:border-white/30 
                                text-gray-900 dark:text-white 
                                hover:bg-gray-900/10 dark:hover:bg-white/20 
                                hover:border-gray-900/40 dark:hover:border-white/60 
                                transition-all duration-300 
                                text-base px-8 py-6 rounded-xl"
                        >
                            <a href="#contact">Contact Sales</a>
                        </Button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Hero;