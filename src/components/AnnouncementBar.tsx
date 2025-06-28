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
        <div className="relative w-full bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white text-sm py-3 px-4 flex items-center justify-center overflow-hidden shadow-md">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:16px_16px]"></div>
            
            <motion.div
                className="whitespace-nowrap font-medium text-center relative z-10"
                animate={controls}
                initial={{ x: '100%' }}
                transition={{ duration: 15, ease: 'linear' }}
            >
                <span className="inline-flex items-center gap-2">
                    <span className="text-lg">🎉</span>
                    <span>Welcome to Danamo Tech! Get</span>
                    <span className="font-bold bg-white/20 px-2 py-1 rounded-full">20% OFF</span>
                    <span>all services this month — Book your</span>
                    <span className="font-bold underline">FREE consultation</span>
                    <span>today!</span>
                    <span className="text-lg">🚀</span>
                </span>
            </motion.div>

            {onClose && (
                <button 
                    onClick={onClose} 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors duration-200 z-20"
                    aria-label="Close announcement"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    )
}
