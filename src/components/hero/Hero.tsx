"use client";

import Image from "next/image";
import heroImg from "../../../public/hero-img.jpg";
import { Button } from "@/components/ui/button";

const Hero = () => {
    return (
        <section
            className="w-full py-[15px] transition-colors duration-700 bg-gradient-to-b from-white to-gray-100 dark:from-[#0e0e15] dark:to-[#1E1E2F]"
        >
            <div className="layout flex flex-col lg:flex-row items-center justify-between gap-10">
                {/* Left Side: Text Content */}
                <div className="text-center lg:text-left max-w-xl">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
                        Empowering Digital Innovation with{" "}
                        <span className="text-blue-600 dark:text-blue-400">Danamo Tech</span>
                    </h1>
                    <p className="text-lg text-muted-foreground mb-6">
                        We build scalable web apps, design modern interfaces, and deliver
                        top-notch DevOps solutions for startups and enterprises.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        {/* Our Services button */}
                        <Button
                            asChild
                            size="lg"
                            className="bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                        >
                            <a href="/services">Our Services</a>
                        </Button>

                        {/* Contact Us button */}
                        <Button
                            asChild
                            size="lg"
                            className="bg-blue-600 text-white transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                        >
                            <a href="/contact">Contact Us</a>
                        </Button>
                    </div>
                </div>

                {/* Right Side: Hero Image */}
                <div className="w-full max-w-md lg:max-w-lg">
                    <Image
                        src={heroImg}
                        alt="Hero image"
                        className="w-full h-auto object-contain"
                        priority
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;
