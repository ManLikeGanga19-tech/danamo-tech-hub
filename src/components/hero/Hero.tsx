"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ArrowRight, Sparkles } from "lucide-react";
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
    const heroImage = mounted && resolvedTheme === "dark" ? heroImgDark : heroImgLight;

    return (
        <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden transition-colors duration-700 bg-gradient-to-b from-white to-gray-50 dark:from-[#0e0e15] dark:to-[#1E1E2F]">
            <div className="layout w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 py-12 md:py-24">

                {/* Left Side: Text Content */}
                <div className="text-left max-w-2xl lg:w-1/2 z-10">
                    {/* Enterprise Badge */}
                    {/* <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20 px-4 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 mb-8 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>Next-Gen Enterprise Solutions</span>
                    </div> */}

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight text-gray-900 dark:text-white">
                        Empowering Digital Innovation with{" "}
                        <span className="text-blue-600 dark:text-blue-400">
                            Danamo Tech
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-xl leading-relaxed">
                        We build scalable web apps, design modern interfaces, and deliver
                        top-notch DevOps solutions for startups and enterprises.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Button
                            asChild
                            size="lg"
                            className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-600/20 text-base px-8 py-6 rounded-xl"
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
                            className="w-full sm:w-auto border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 text-base px-8 py-6 rounded-xl"
                        >
                            <a href="#contact">Contact Sales</a>
                        </Button>
                    </div>
                </div>

                {/* Right Side: Hero Image (Now much larger) */}
                <div className="w-full lg:w-1/2 relative h-[400px] sm:h-[500px] lg:h-[650px] flex items-center justify-center">
                    <Image
                        src={heroImage}
                        alt="Danamo Tech Digital Innovation"
                        fill
                        priority
                        placeholder="blur"
                        // Updated sizes for the larger container
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                        className="object-contain drop-shadow-2xl transition-opacity duration-500"
                    />

                    {/* Optional: Ambient glowing effect behind the image */}
                    <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
                </div>

            </div>
        </section>
    );
};

export default Hero;