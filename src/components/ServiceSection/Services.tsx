"use client"

import React, { memo } from "react"
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

const ServiceCard = memo(({ service, index }: { service: Service; index: number }) => (
    <Card
        className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E1E2F] hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1"
        role="article"
        aria-labelledby={`service-${index}`}
    >
        <CardHeader className="flex flex-col gap-4 items-start p-8 flex-grow">
            {/* Corporate Icon Badge */}
            <div 
                className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 group-hover:scale-105 transition-transform duration-300" 
                aria-hidden="true"
            >
                {service.icon}
            </div>
            <div>
                <CardTitle id={`service-${index}`} className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {service.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {service.description}
                </CardDescription>
            </div>
        </CardHeader>
    </Card>
))

ServiceCard.displayName = "ServiceCard"

export default function Services() {
    return (
        <section
            className="w-full py-24 bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F] overflow-hidden relative"
            id="services"
            aria-labelledby="services-heading"
        >
            <div className="layout w-full max-w-[85rem] mx-auto px-4 md:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2
                        id="services-heading"
                        className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white"
                    >
                        Our <span className="text-blue-600 dark:text-blue-400">Services</span>
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Enterprise-grade digital solutions designed to scale your business, streamline operations, and drive innovation.
                    </p>
                </div>

                {/* Static Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} index={index} />
                    ))}
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