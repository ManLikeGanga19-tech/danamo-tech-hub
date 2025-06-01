'use client'

import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import Link from 'next/link'
import { Logo } from "@/components/Logo";

export default function Footer() {
  return (
    <footer
      className="w-full min-h-[400px] px-4 py-10 transition-colors duration-700 bg-gradient-to-b from-gray-100 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]  flex flex-col items-center justify-center"
    >
      <hr className="w-full border-t border-gray-300 dark:border-gray-700 mb-4 pt-4" />

      {/* Top Section: Logo & Links */}
      <div className="w-full max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-4 gap-10 items-center md:items-start text-center md:text-left">
        {/* Logo */}
        <div>
          <Logo className='text-lg' />
        </div>

        {/* Company Links */}
        <div>
          <h4 className="font-semibold mb-3 text-black dark:text-blue-400">Company</h4>
          <ul className="space-y-2 text-md">
            <li><Link href="/about" className="hover:no-underline text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">About</Link></li>
            <li><Link href="/careers" className="hover:no-underline text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">Careers</Link></li>
            <li><Link href="/services" className="hover:no-underline text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">Services</Link></li>
            <li><Link href="/team" className="hover:no-underline text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">Our Team</Link></li>
          </ul>
        </div>

        {/* Resources Links */}
        <div>
          <h4 className="font-semibold mb-3 text-black dark:text-blue-400">Resources</h4>
          <ul className="space-y-2 text-md">
            <li><Link href="/blog" className="hover:no-underline hover:text-blue-600 text-gray-800 dark:text-white dark:hover:text-blue-400">Blog</Link></li>
            <li><Link href="/faqs" className="hover:no-underline hover:text-blue-600 text-gray-800 dark:text-white dark:hover:text-blue-400">FAQs</Link></li>
            <li><Link href="/webinars" className="hover:no-underline hover:text-blue-600 text-gray-800 dark:text-white dark:hover:text-blue-400">Webinars / Events</Link></li>
            <li><Link href="/help-center" className="hover:no-underline hover:text-blue-600 text-gray-800 dark:text-white dark:hover:text-blue-400">Help Center</Link></li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h4 className="font-semibold mb-3 text-black dark:text-blue-400">Legal</h4>
          <ul className="space-y-2 text-md">
            <li><Link href="/accessibility" className="hover:no-underline text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">Accessibility</Link></li>
            <li><Link href="/privacy" className="hover:no-underline text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</Link></li>
            <li><Link href="/cookies" className="hover:no-underline text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">Cookies Policy</Link></li>
            <li><Link href="/terms" className="hover:no-underline text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">Terms of Service / Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="w-full mt-10 flex flex-col items-center">
        <h4 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">Connect with us</h4>
        <div className="flex space-x-4 mb-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
            <FaFacebookF className="w-5 h-5" />
          </a>
          <a href="mailto:hello@danamotech.com" className="hover:text-red-500">
            <MdEmail className="w-6 h-6" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
            <FaInstagram className="w-5 h-5" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">
            <FaLinkedinIn className="w-5 h-5" />
          </a>
        </div>

        {/* Separator */}
        <hr className="w-full border-t border-gray-300 dark:border-gray-700 mb-4" />

        {/* Bottom Text */}
        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">&copy; 2025 Danamo Tech. All rights reserved.</p>
      </div>
    </footer>
  )
}
