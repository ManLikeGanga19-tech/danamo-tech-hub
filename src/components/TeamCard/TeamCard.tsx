"use client"

import React from "react"
import { Github, Linkedin } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image";

interface TeamCardProps {
    name: string
    role: string
    bio: string
    imageUrl: string
    socials?: {
        linkedin?: string
        github?: string
    }
}

export const TeamCard: React.FC<TeamCardProps> = ({ name, role, bio, imageUrl, socials }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="group relative bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 p-8 flex flex-col items-center text-center"
        >
            {/* Avatar with Gradient Ring */}
            <div className="relative w-32 h-32 mb-6 rounded-full p-1 bg-gradient-to-tr from-blue-600 to-cyan-400">
                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                    <Image
                        src={imageUrl}
                        alt={name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{name}</h3>
            <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4">{role}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-grow">{bio}</p>
            
            {/* Corporate Social Buttons */}
            <div className="flex gap-3 mt-auto">
                {socials?.linkedin && (
                    <a 
                        href={socials.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 transition-all duration-300"
                    >
                        <Linkedin className="w-4 h-4" />
                    </a>
                )}
                {socials?.github && (
                    <a 
                        href={socials.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-200 dark:hover:text-white dark:hover:bg-gray-700 transition-all duration-300"
                    >
                        <Github className="w-4 h-4" />
                    </a>
                )}
            </div>
        </motion.div>
    )
}