'use client'

import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full pt-16 pb-8 transition-colors duration-700 bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F] border-t border-gray-200 dark:border-gray-800">
      <div className="layout w-full max-w-[85rem] mx-auto px-4 md:px-8">

        {/* Top Section: Logo, Description, Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">

          {/* Brand & Social Column (Takes up 2 columns on large screens) */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link href="/" className="mb-6 inline-block">
              <Image
                src="/nav-img.jpg"
                alt="Danamo Tech Logo"
                width={160}
                height={45}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm leading-relaxed">
              Bridging the technology gap for businesses and startups. We deliver enterprise-grade web, software, and digital solutions.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#1E1E2F] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:border-blue-600 dark:hover:text-blue-400 dark:hover:border-blue-400 transition-all duration-300">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href="mailto:hello@danamotech.com" className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#1E1E2F] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-red-500 hover:border-red-500 dark:hover:text-red-400 dark:hover:border-red-400 transition-all duration-300">
                <MdEmail className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#1E1E2F] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-pink-500 hover:border-pink-500 dark:hover:text-pink-400 dark:hover:border-pink-400 transition-all duration-300">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#1E1E2F] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-blue-700 hover:border-blue-700 dark:hover:text-blue-500 dark:hover:border-blue-500 transition-all duration-300">
                <FaLinkedinIn className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase mb-6 text-gray-900 dark:text-white">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Careers</Link></li>
              <li><Link href="/services" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Services</Link></li>
              <li><Link href="/team" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Our Team</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase mb-6 text-gray-900 dark:text-white">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="/blog" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</Link></li>
              <li><Link href="/faqs" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQs</Link></li>
              <li><Link href="/webinars" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Webinars & Events</Link></li>
              <li><Link href="/help-center" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase mb-6 text-gray-900 dark:text-white">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/accessibility" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Accessibility</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookies Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} Danamo Tech. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}