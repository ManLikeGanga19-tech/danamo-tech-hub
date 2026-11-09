"use client"

import React, { useRef, useEffect, memo, useState } from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
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
    ArrowRight
} from "lucide-react"
import { motion, useMotionValue, useAnimationFrame, useTransform } from "framer-motion"
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
        icon: <Code2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
    {
        title: "Search Engine Optimisation",
        description: "Improve your online visibility and drive organic traffic with SEO best practices.",
        icon: <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
    {
        title: "Branding & UI/UX Design",
        description: "Designing digital experiences that resonate with your brand and audience.",
        icon: <Brush className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
    {
        title: "Social Media & Digital Marketing",
        description: "Strategic content and marketing to grow your online presence and engagement.",
        icon: <Megaphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
    {
        title: "E-Commerce Solutions",
        description: "Robust online stores with secure checkout and smooth user experience.",
        icon: <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
    {
        title: "IT Consulting & Support",
        description: "Expert advice and hands-on support to keep your IT systems running smoothly.",
        icon: <Headphones className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
    {
        title: "SaaS Product Development",
        description: "Build scalable SaaS platforms from MVP to full product lifecycle.",
        icon: <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
    {
        title: "Cloud & DevOps",
        description: "CI/CD implementation, serverless architecture, and cloud hosting solutions.",
        icon: <ServerCog className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
]

const topRow = services.slice(0, 4)
const bottomRow = services.slice(4)

const ServiceCard = memo(({ service, index }: { service: Service; index: number }) => (
    <Card
        className="group relative min-w-[280px] md:min-w-[320px] max-w-sm w-full shrink-0 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-[#1E1E2F]/60 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700"
        role="article"
        aria-labelledby={`service-${index}`}
    >
        <CardHeader className="flex flex-col gap-4 items-start p-6">
            {/* Corporate Icon Badge */}
            <div 
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 group-hover:scale-110 transition-transform duration-300" 
                aria-hidden="true"
            >
                {service.icon}
            </div>
            <div>
                <CardTitle id={`service-${index}`} className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {service.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {service.description}
                </CardDescription>
            </div>
        </CardHeader>
        {/* Subtle bottom accent line on hover */}
        <div className="absolute bottom-0 left-0 h-1 w-0 bg-blue-600 dark:bg-blue-400 transition-all duration-500 group-hover:w-full" />
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
    const [isHovered, setIsHovered] = useState(false)
    const isLeft = direction === "left"
    
    // useMotionValue tracks the exact percentage mathematically
    const baseX = useMotionValue(isLeft ? 0 : -50)
    
    // Reset position if direction changes
    useEffect(() => {
        baseX.set(isLeft ? 0 : -50)
    }, [isLeft, baseX])

    // Convert the motion value to a CSS percentage
    const x = useTransform(baseX, (v) => `${v}%`)

    // This hook calculates the exact movement frame-by-frame for perfect smoothness
    useAnimationFrame((t, delta) => {
        if (isHovered) return // Instantly pauses without snapping
        
        // Speed: roughly 3% movement per second
        const moveBy = (isLeft ? -1 : 1) * (delta / 1000) * 3
        
        let newX = baseX.get() + moveBy
        
        // Wrap-around logic for seamless infinite loop
        if (isLeft) {
            if (newX <= -50) newX = 0
        } else {
            if (newX >= 0) newX = -50
        }
        
        baseX.set(newX)
    })

    // We duplicate the items to allow the seamless -50% wrap-around
    const duplicatedItems = [...items, ...items]

    return (
        <div
            className="relative overflow-hidden w-full py-4 transition-colors duration-700 bg-transparent"
            role="region"
            aria-label={ariaLabel}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex justify-center">
                <div
                    className="overflow-x-hidden w-full px-4 cursor-grab active:cursor-grabbing"
                    tabIndex={0}
                >
                    <motion.div
                        className="flex gap-6 w-max"
                        style={{ x, willChange: "transform" }}
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

            {/* Corporate Edge Gradients (Smooth fade to background) */}
            <div
                className="pointer-events-none absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-gray-50 to-transparent dark:from-[#0e0e15] dark:to-transparent z-10"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-gray-50 to-transparent dark:from-[#0e0e15] dark:to-transparent z-10"
                aria-hidden="true"
            />
        </div>
    )
})

InfiniteSlider.displayName = "InfiniteSlider"

export default function Services() {
    return (
        <section
            className="w-full py-24 bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F] overflow-hidden relative"
            id="services"
            aria-labelledby="services-heading"
        >
            <div className="w-full">
                <div className="max-w-4xl mx-auto px-4 md:px-8 text-center mb-16">
                    <h2
                        id="services-heading"
                        className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white"
                    >
                        Our <span className="text-blue-600 dark:text-blue-400">Services</span>
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Enterprise-grade digital solutions designed to scale your business, streamline operations, and drive innovation.
                    </p>
                </div>

                {/* Sliders with slight spacing between rows */}
                <div className="flex flex-col gap-6">
                    <InfiniteSlider
                        items={topRow}
                        direction="left"
                        ariaLabel="Primary services carousel"
                    />
                    <InfiniteSlider
                        items={bottomRow}
                        direction="right"
                        ariaLabel="Additional services carousel"
                    />
                </div>
                
                {/* Corporate CTA at the bottom */}
                <div className="flex justify-center mt-16">
                    <a 
                        href="/services" 
                        className="group inline-flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        View all services
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </section>
    )
}