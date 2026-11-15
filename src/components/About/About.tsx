"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const AboutUs = () => {
    const fullText =
        "Danamo Tech is a privately owned company headquartered in Mombasa, Kenya founded in 2024, the company was established to bridge the technology gap faced by small businesses and startups in need of affordable digital solutions.";

    const specializations = [
        "Web Development",
        "Search Engine Optimization (SEO)",
        "Branding & UI/UX",
        "Digital Marketing",
        "Custom Software Solutions"
    ];

    return (
        <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden">
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/about.jpg"
                    alt="Danamo Tech Team"
                    fill
                    priority
                    className="object-cover object-center"
                />
                {/* Consistent dark overlay */}
                <div className="absolute inset-0 bg-black/70" />
            </div>

            {/* Content */}
            <div className="layout relative z-10 w-full max-w-[85rem] mx-auto px-4 md:px-8 py-24 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="max-w-3xl">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-[1.1] tracking-tight text-white">
                        About <span className="text-blue-400">Us</span>
                    </h2>

                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
                        Bridging the technology gap for businesses and startups.
                    </h3>

                    <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                        {fullText}
                    </p>

                    <div className="mb-10 max-w-2xl mx-auto lg:mx-0">
                        <p className="text-sm font-bold text-blue-300 uppercase tracking-wider mb-4">
                            What we specialize in:
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                            {specializations.map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600/30 backdrop-blur-sm border border-blue-400/40 flex-shrink-0">
                                        <Check className="w-3 h-3 text-blue-300" />
                                    </div>
                                    <span className="text-gray-100 font-medium">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Button
                        asChild
                        size="lg"
                        className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-600/30 text-base px-8 py-6 rounded-xl group"
                    >
                        <a href="/about" className="flex items-center gap-2">
                            Learn More About Us
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;