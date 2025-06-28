"use client"

import React, { useRef, useMemo, useEffect } from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Code2,
    Megaphone,
    ShoppingCart,
    Headphones,
    Package,
    ServerCog,
    Brush,
    Zap,
} from "lucide-react"
import { motion, useAnimation } from "framer-motion"
import "../../app/globals.css";

// Define Service interface
interface Service {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const services: Service[] = [
    {
        title: "Custom Web Development",
        description: "Tailored websites and web apps to meet your unique business needs.",
        icon: <Code2 className="h-6 w-6 text-primary" />,
    },
    {
        title: "Search Engine Optimisation",
        description: "Improve your online visibility and drive organic traffic with SEO best practices.",
        icon: <Zap className="h-6 w-6 text-primary" />,
    },
    {
        title: "Branding & UI/UX Design",
        description: "Designing digital experiences that resonate with your brand and audience.",
        icon: <Brush className="h-6 w-6 text-primary" />,
    },
    {
        title: "Social Media & Digital Marketing",
        description: "Strategic content and marketing to grow your online presence and engagement.",
        icon: <Megaphone className="h-6 w-6 text-primary" />,
    },
    {
        title: "E-Commerce Solutions",
        description: "Robust online stores with secure checkout and smooth user experience.",
        icon: <ShoppingCart className="h-6 w-6 text-primary" />,
    },
    {
        title: "IT Consulting & Support",
        description: "Expert advice and hands-on support to keep your IT systems running smoothly.",
        icon: <Headphones className="h-6 w-6 text-primary" />,
    },
    {
        title: "SaaS Product Development",
        description: "Build scalable SaaS platforms from MVP to full product lifecycle.",
        icon: <Package className="h-6 w-6 text-primary" />,
    },
    {
        title: "Cloud & DevOps",
        description: "CI/CD implementation, serverless architecture, and cloud hosting solutions.",
        icon: <ServerCog className="h-6 w-6 text-primary" />,
    },
]

const topRow = services.slice(0, 4)
const bottomRow = services.slice(4)

const InfiniteSlider = ({
    items,
    direction = "left",
}: {
    items: Service[]
    direction?: "left" | "right"
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const controls = useAnimation()

    const isLeft = direction === "left"
    const animationX = useMemo(() => (isLeft ? ["0%", "-50%"] : ["-50%", "0%"]), [isLeft])

    useEffect(() => {
        controls.start({
            x: animationX,
            transition: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
            },
        })
    }, [controls, animationX])

    return (
        <section className="relative overflow-hidden w-full py-8 sm:py-12 transition-colors duration-700 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"></div>
            
            <div className="flex justify-center relative z-10">
                <div ref={containerRef} className="overflow-x-auto cursor-pointer scrollbar-hide max-w-full">
                    <motion.div
                        className="flex gap-6 w-max"
                        animate={controls}
                    >
                        {[...items, ...items].map((service, index) => (
                            <Card
                                key={index}
                                className="w-[320px] sm:w-[340px] shrink-0 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:border-blue-300 dark:hover:border-blue-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 group hover:-translate-y-2"
                            >
                                <CardHeader className="flex flex-col gap-4 items-start p-6">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors duration-300">
                                        <div className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                            {service.icon}
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                        {service.title}
                                    </CardTitle>
                                    <CardDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {service.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 pt-0">
                                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                                        <span className="text-sm">Learn more</span>
                                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Enhanced gradient overlays */}
            <div className="pointer-events-none absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent dark:from-gray-800 dark:via-gray-800/80 dark:to-transparent z-20" />
            <div className="pointer-events-none absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent dark:from-gray-800 dark:via-gray-800/80 dark:to-transparent z-20" />
        </section>
    )
}

export default function Services() {
    return (
        <section
            className="relative w-full py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950/20 overflow-hidden"
            id="services"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"></div>
            <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            <div className="container mx-auto max-w-7xl px-4 md:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        Our{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                            Services
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                        Comprehensive digital solutions tailored to accelerate your business growth
                    </p>
                </div>

                {/* Top: scroll right to left */}
                <InfiniteSlider items={topRow} direction="left" />

                <div className="h-8" />

                {/* Bottom: scroll left to right */}
                <InfiniteSlider items={bottomRow} direction="right" />
                
                {/* Call to action */}
                <div className="text-center mt-16">
                    <Button
                        asChild
                        size="lg"
                        className="px-8 py-4 text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        <a href="/services">View All Services</a>
                    </Button>
                </div>
            </div>
        </section>
    )
}
