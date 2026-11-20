// Server component: the service data stays on the server instead of being
// shipped to the browser just to render these cards.
import Link from "next/link"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { services, type Service } from "@/lib/services"
import { ServiceIcon } from "@/components/services/ServiceIcon"

function ServiceCard({ service, index }: { service: Service; index: number }) {
    return (
    <Link
        href={`/services/${service.slug}`}
        className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-labelledby={`service-${index}`}
    >
        <Card className="relative flex flex-col h-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E1E2F] group-hover:shadow-xl group-hover:shadow-blue-500/5 group-hover:border-blue-200 dark:group-hover:border-blue-900 transition-all duration-300 group-hover:-translate-y-1">
            <CardHeader className="flex flex-col gap-4 items-start p-8 flex-grow">
                <div
                    className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 group-hover:scale-105 transition-transform duration-300"
                    aria-hidden="true"
                >
                    <ServiceIcon icon={service.icon} />
                </div>
                <div className="flex-grow">
                    <CardTitle id={`service-${index}`} className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {service.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {service.summary}
                    </CardDescription>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                    Learn more
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </span>
            </CardHeader>
        </Card>
    </Link>
    )
}

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
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                        Enterprise-grade digital solutions designed to scale your business, streamline operations, and drive innovation.
                    </p>
                </div>

                {/* Static Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard key={service.slug} service={service} index={index} />
                    ))}
                </div>
                
                {/* Corporate CTA at the bottom */}
                <div className="flex justify-center mt-16">
                    <Link
                        href="/services" 
                        className="group inline-flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        View all services
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    )
}