"use client";

import Image from "next/image";
import heroImg from "../../../public/hero-img.jpg";
import { Button } from "@/components/ui/button";

const Hero = () => {
    return (
        <section
            className="w-full py-12 md:py-20 transition-colors duration-700 bg-gradient-to-b from-white to-gray-100 dark:from-[#0e0e15] dark:to-[#1E1E2F]"
        >
            <div className="layout flex flex-col lg:flex-row items-center justify-between gap-12">
                {/* Left Side: Text Content */}
                <div className="text-left max-w-xl">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight tracking-tight">
                        Empowering Digital Innovation with{" "}
                        <span className="text-blue-600 dark:text-blue-400">Danamo Tech</span>
                    </h1>
                    <p className="text-lg text-muted-foreground mb-8">
                        We build scalable web apps, design modern interfaces, and deliver
                        top-notch DevOps solutions for startups and enterprises.
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Get started button */}
                        <Button
                            asChild
                            size="lg"
                            className="bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                        >
                            <a href="/services">Get Started</a>
                        </Button>
                    </div>
                </div>

                {/* Right Side: Hero Image */}
                <div className="w-full max-w-md lg:max-w-lg relative aspect-[4/3]">
                    <Image
                        src={heroImg}
                        alt="Team working on digital innovation"
                        fill
                        priority
                        placeholder="blur"
                        sizes="(max-width: 768px) 100vw, 
                   (max-width: 1200px) 50vw, 
                   600px"
                        className="object-contain"
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;
