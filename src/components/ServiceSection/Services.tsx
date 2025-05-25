"use client"

import React, { useRef } from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card"
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
import { useEffect, useState } from "react"
import "../../app/globals.css";

const services = [
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
    items: typeof services
    direction?: "left" | "right"
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const controls = useAnimation()
    const [isHovered, setIsHovered] = useState(false)

    const isLeft = direction === "left"
    const animationX = isLeft ? ["0%", "-50%"] : ["-50%", "0%"]

    useEffect(() => {
        const startAnimation = async () => {
            while (true) {
                if (!isHovered) {
                    await controls.start({
                        x: animationX,
                        transition: {
                            repeat: Infinity,
                            duration: 20, // faster scroll
                            ease: "linear",
                        },
                    })
                }
                await new Promise((resolve) => setTimeout(resolve, 100))
            }
        }
        startAnimation()
    }, [controls, isHovered, animationX])

    return (
        <section
            className="relative overflow-hidden w-full py-[15px] transition-colors duration-700 bg-gradient-to-b from-white to-gray-100 dark:from-[#0e0e15] dark:to-[#1E1E2F]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div ref={containerRef} className="overflow-x-auto cursor-pointer scrollbar-hide">
                <motion.div
                    className="flex gap-6 w-max"
                    drag="x"
                    dragConstraints={containerRef}
                    dragElastic={0.05}
                    animate={controls}
                >

                    {[...items, ...items].map((service, index) => (
                        <Card
                            key={index}
                            className="w-[300px] shrink-0 hover:shadow-lg transition-shadow duration-300 hover:border-blue-200"
                        >
                            <CardHeader className="flex flex-col gap-3 items-start">
                                {service.icon}
                                <CardTitle className="text-blue-600 dark:text-blue-400">
                                    {service.title}
                                </CardTitle>
                                <CardDescription>{service.description}</CardDescription>
                            </CardHeader>
                            <CardContent />
                        </Card>
                    ))}
                </motion.div>
            </div>
            {/* Left gradient */}
            <div className="pointer-events-none absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-[rgba(255,255,255,1)] to-[rgba(255,255,255,0)] dark:from-[#0e0e15] dark:to-transparent z-10" />

            {/* Right gradient */}
            <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-[rgba(255,255,255,1)] to-[rgba(255,255,255,0)] dark:from-[#0e0e15] dark:to-transparent z-10" />

        </section>
    )
}

export default function Services() {
    return (
        <section
            className="w-full py-16 bg-gradient-to-b from-white to-gray-100 dark:from-[#0e0e15] dark:to-[#1E1E2F]"
            id="services"
        >
            <div className="container px-4 md:px-8">
                <h2 className="text-3xl font-bold text-center mb-10 text-blue-600 dark:text-blue-400">
                    Our <span className="text-black dark:text-white">Services</span>
                </h2>

                {/* Top: scroll right to left */}
                <InfiniteSlider items={topRow} direction="left" />

                <div className="h-5" />

                {/* Bottom: scroll left to right */}
                <InfiniteSlider items={bottomRow} direction="right" />
            </div>
        </section>
    )
}

