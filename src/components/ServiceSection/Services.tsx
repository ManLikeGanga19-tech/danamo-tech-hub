"use client"

import React, { useRef, useEffect, memo } from "react"
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
import "../../app/globals.css"

interface Service {
    title: string
    description: string
    icon: React.ReactNode
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

const ServiceCard = memo(({ service, index }: { service: Service; index: number }) => (
    <Card
        className="min-w-[250px] md:min-w-[300px] max-w-sm w-full shrink-0 hover:shadow-lg transition-shadow duration-300 hover:border-blue-200"
        role="article"
        aria-labelledby={`service-${index}`}
    >
        <CardHeader className="flex flex-col gap-3 items-start">
            <div aria-hidden="true">{service.icon}</div>
            <CardTitle id={`service-${index}`} className="text-blue-600 dark:text-blue-400">
                {service.title}
            </CardTitle>
            <CardDescription>{service.description}</CardDescription>
        </CardHeader>
        <CardContent />
    </Card>
))

ServiceCard.displayName = "ServiceCard"

const InfiniteSlider = memo(({
    items,
    direction = "left",
    ariaLabel,
}: {
    items: Service[]
    direction?: "left" | "right"
    ariaLabel: string
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const controls = useAnimation()

    useEffect(() => {
        const isLeft = direction === "left"
        const animationX = isLeft ? ["0%", "-50%"] : ["-50%", "0%"]

        controls.start({
            x: animationX,
            transition: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
            },
        })
    }, [controls, direction])

    const duplicatedItems = [...items, ...items]

    return (
        <div
            className="relative overflow-hidden w-full py-[15px] transition-colors duration-700 bg-gradient-to-b from-white to-white dark:from-[#1E1E2F] dark:to-[#1E1E2F]"
            role="region"
            aria-label={ariaLabel}
        >
            <div className="flex justify-center">
                <div
                    ref={containerRef}
                    className="overflow-x-auto cursor-pointer scrollbar-hide w-full px-4"
                    tabIndex={0}
                >
                    <motion.div
                        className="flex gap-6 w-max"
                        animate={controls}
                    >
                        {duplicatedItems.map((service, index) => (
                            <ServiceCard
                                key={`${service.title}-${index}`}
                                service={service}
                                index={index}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>

            <div
                className="pointer-events-none absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-[rgba(255,255,255,1)] to-[rgba(255,255,255,0)] dark:from-[#0e0e15] dark:to-transparent z-10"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-[rgba(255,255,255,1)] to-[rgba(255,255,255,0)] dark:from-[#0e0e15] dark:to-transparent z-10"
                aria-hidden="true"
            />
        </div>
    )
})

InfiniteSlider.displayName = "InfiniteSlider"

export default function Services() {
    return (
        <section
            className="w-full py-16 bg-gradient-to-b from-gray-100 to-white dark:from-[#1E1E2F] dark:to-[#1E1E2F]"
            id="services"
            aria-labelledby="services-heading"
        >
            <div className="w-full">
                <div className="max-w-6xl mx-auto px-4 md:px-8">
                    <h2
                        id="services-heading"
                        className="text-3xl font-bold text-center mb-10 text-blue-600 dark:text-blue-400"
                    >
                        Our <span className="text-black dark:text-white">Services</span>
                    </h2>
                </div>

                <InfiniteSlider
                    items={topRow}
                    direction="left"
                    ariaLabel="Primary services carousel"
                />
                <div className="h-5" aria-hidden="true" />
                <InfiniteSlider
                    items={bottomRow}
                    direction="right"
                    ariaLabel="Additional services carousel"
                />
            </div>
        </section>
    )
}