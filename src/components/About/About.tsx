"use client"

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const AboutUs = () => {
    const [showText, setShowText] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const fullText = "Danamo Tech is a privately owned company headquartered in Nairobi, Kenya founded in 2024, the company was established to bridge the technology gap faced by small businesses and startups in need of affordable digital solutions";
    const [typedText, setTypedText] = useState("");

    useEffect(() => {
        if (!showText) return;

        let index = 0;
        const interval = setInterval(() => {
            setTypedText(fullText.slice(0, index));
            index++;
            if (index > fullText.length) clearInterval(interval);
        }, 30);
        return () => clearInterval(interval);
    }, [showText]);

    // Intersection observer to trigger animation on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setShowText(true);
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="w-full py-[15px] transition-colors duration-700 bg-gradient-to-b from-white to-gray-100 dark:from-[#1E1E2F] dark:to-[#0e0e15]"
        >
            <h2 className="mt-10 text-4xl font-bold text-blue-600 mb-10 text-center dark:text-blue-400">About <span className="text-black dark:text-white">Us</span> </h2>

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10">
                {/* Image (hidden on small screens) */}
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

                {/* Text */}
                <div className="w-full md:w-1/2 text-center md:text-left pb-[16em]">
                    <p className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {typedText}
                        <span className="animate-blink text-[#2563EB]">|</span>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
