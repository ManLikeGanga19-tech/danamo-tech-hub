"use client";

import Image from "next/image";
// import heroImg from "@/public/hero.png";
import { Button } from "@/components/ui/button";

const Hero = () => {
    return (
        <>
            <section className="w-full py-20 bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900">
                <div className="layout flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
                    {/* Left Side: Text Content */}
                    <div className="text-center lg:text-left max-w-xl">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
                            Empowering Digital Innovation with <span className="text-blue-600 dark:text-blue-400">Danamo Tech</span>
                        </h1>
                        <p className="text-lg text-muted-foreground mb-6">
                            We build scalable web apps, design modern interfaces, and deliver top-notch DevOps solutions for startups and enterprises.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            {/* Our Services button (white background, black text) */}
                            <Button
                                asChild
                                size="lg"
                                className="bg-white text-black border border-black transition-colors duration-300 ease-in-out hover:bg-black hover:text-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
                            >
                                <a href="/services">Our Services</a>
                            </Button>

                            {/* Contact Us button (black background, white text) */}
                            <Button
                                asChild
                                size="lg"
                                className="bg-black text-white transition-colors duration-300 ease-in-out hover:bg-white hover:text-black dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
                            >
                                <a href="/contact">Contact Us</a>
                            </Button>
                        </div>
                    </div>

                    {/* Right Side: Hero Image */}
                    <div className="w-full max-w-md lg:max-w-lg">
                        <Image
                            src=""
                            alt="Hero image"
                            className="w-full h-auto object-contain"
                            priority
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

export default Hero;
