"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import both images so Next.js optimizes and blurs them automatically
import heroImgLight from "../../../public/hero-img.jpg";
import heroImgDark from "../../../public/hero-img-dark.jpg";

const Hero = () => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    // Prevent hydration mismatch by waiting until mounted
    useEffect(() => {
        setMounted(true);
    }, []);

    // Determine which image to show
    const isDark = mounted && resolvedTheme === "dark";
    const heroImage = isDark ? heroImgDark : heroImgLight;

    return (
        <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden transition-colors duration-700 bg-gray-100 dark:bg-gray-900">
            
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    key={isDark ? "dark" : "light"}
                    src={heroImage}
                    alt="Danamo Tech Digital Innovation"
                    fill
                    priority
                    placeholder="blur"
                    sizes="100vw"
                    className="object-cover object-center"
                />
                {/* Overlay: light white wash in light mode, dark wash in dark mode */}
                <div className="absolute inset-0 bg-white/60 dark:bg-black/70 transition-colors duration-700" />
                {/* Subtle bottom gradient to blend into next section */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-gray-50 dark:to-[#0e0e15]" />
            </div>

            {/* Content Container */}
            <div className="layout relative z-10 w-full max-w-[85rem] mx-auto px-4 md:px-8 py-24 flex flex-col items-center lg:items-start text-center lg:text-left">
                
                <div className="max-w-3xl">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight text-gray-900 dark:text-white drop-shadow-sm">
                        Empowering Digital Innovation with{" "}
                        <span className="text-blue-700 dark:text-blue-400">
                            Danamo Tech
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-10 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                        We build scalable web apps, design modern interfaces, and deliver
                        top-notch DevOps solutions for startups and enterprises.
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