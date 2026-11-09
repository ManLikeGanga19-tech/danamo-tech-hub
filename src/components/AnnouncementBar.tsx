'use client'

import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { X } from 'lucide-react';

type AnnouncementBarProps = {
    onClose?: () => void
}

export default function AnnouncementBar({ onClose }: AnnouncementBarProps) {
    const controls = useAnimation()

    useEffect(() => {
        const loop = async () => {
            while (true) {
                await controls.start({ x: '-100%' })
                controls.set({ x: '100%' })
            }
        }
        loop()
    }, [controls])

    return (
        <div className="w-full transition-colors duration-700 bg-gradient-to-b from-gray-100 to-white dark:from-[#1E1E2F] dark:to-[#1E1E2F] text-black dark:text-white text-sm py-2 px-4 flex items-center justify-between relative overflow-hidden">
            <motion.div
                className="whitespace-nowrap"
                animate={controls}
                initial={{ x: '100%' }}
                transition={{ duration: 12, ease: 'linear' }}
            >
                🎉 Welcome to Danamo Tech! Get 20% OFF all services this month — Book your FREE consultation today! 🚀
            </motion.div>

            {onClose && (
                <button onClick={onClose} className="absolute right-2 top-2">
                    <X size={16} />
                </button>
            )}
        </div>
    )
}
