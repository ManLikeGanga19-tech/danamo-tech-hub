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
            className="bg-white dark:bg-[#191924] rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300"
        >
            <Image
                src={imageUrl}
                alt={name}
                className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-blue-500"
            />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h3>
            <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">{role}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{bio}</p>
            <div className="flex gap-4 mt-4">
                {socials?.linkedin && (
                    <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-5 w-5 text-blue-600 dark:text-blue-400 hover:text-blue-800 transition" />
                    </a>
                )}
                {socials?.github && (
                    <a href={socials.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-5 w-5 text-gray-800 dark:text-gray-200 hover:text-gray-600 transition" />
                    </a>
                )}
            </div>
        </motion.div>
    )
} 
