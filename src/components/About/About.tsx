"use client";

import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/app/components/Button";

const AboutUs = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const fullText =
        "Danamo Tech is a privately owned company headquartered in Nairobi, Kenya founded in 2024, the company was established to bridge the technology gap faced by small businesses and startups in need of affordable digital solutions. We specialize in providing high quality web development, search engine optimization(SEO), branding, digital marketing and custom software solutions for businesses and startups.";


    return (
        <section
            ref={sectionRef}
            className="w-full py-[15px] transition-colors duration-700 bg-gradient-to-b from-white to-gray-100 dark:from-[#1E1E2F] dark:to-[#0e0e15]"
        >
            <h2 className="mt-10 text-4xl font-bold text-blue-600 mb-10 text-center dark:text-blue-400">
                About <span className="text-black dark:text-white">Us</span>
            </h2>

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10">
                {/* Image */}
                <div className="hidden md:block w-full md:w-1/2">
                    <Image
                        src="/about.jpg"
                        alt="About Danamo Tech"
                        width={500}
                        height={500}
                        className="rounded-xl shadow-md w-full h-auto object-cover"
                        priority
                    />
                </div>

                {/* Text Section with responsive button */}
                <div className="w-full md:w-1/2 relative px-4 pb-16 flex flex-col items-center justify-start min-h-[300px]">
                    {/* Text */}
                    <p className="text-lg text-black dark:text-white whitespace-pre-line mt-6 text-center leading-relaxed">
                        {fullText}
                    </p>

                    {/* Button for small screens */}
                    <div className="block sm:hidden mt-6">
                        <Button

                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-blue-600 rounded-lg transition duration-300"
                        >
                            <a href="/about-us">View More</a>

                        </Button>
                    </div>

                    {/* Button for large screens */}
                    <Button

                        className="hidden sm:block absolute bottom-4 right-4 px-6 py-2  text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded"
                    >
                        <a href="/about-us">View More</a>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
