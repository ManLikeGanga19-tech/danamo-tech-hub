"use client"

import React from "react"
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
import { motion } from "framer-motion"

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
    const isLeft = direction === "left"
    const animationX = isLeft ? ["0%", "-50%"] : ["-50%", "0%"]

    return (
        <div
            className="overflow-hidden  w-full py-[15px] transition-colors duration-700 bg-gradient-to-b from-white to-gray-100 dark:from-[#0e0e15] dark:to-[#1E1E2F]"
         >
            <motion.div
                className="flex gap-6 w-full"
                animate={{ x: animationX }}
                transition={{
                    repeat: Infinity,
                    duration: 60,
                    ease: "linear",
                }}
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

                <div className="h-10" />

                {/* Bottom: scroll left to right */}
                <InfiniteSlider items={bottomRow} direction="right" />
            </div>
        </section>
    )
}
