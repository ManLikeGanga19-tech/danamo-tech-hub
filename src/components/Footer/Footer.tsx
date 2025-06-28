'use client'

import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import Link from 'next/link'
import { Logo } from "@/components/Logo";

export default function Footer() {
  return (
    <footer
      className="relative w-full bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950/20 transition-colors duration-700 overflow-hidden flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"></div>
      
      <div className="relative z-10">
        {/* Separator */}
        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        
        {/* Main footer content */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Top Section: Logo & Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <Logo className="text-2xl" />
              <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
                Empowering businesses with innovative digital solutions. From web development to cloud services, we're your technology partner.
              </p>
              
              {/* Social Media */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Connect with us</h4>
                <div className="flex space-x-4">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200 group"
                  >
                    <FaFacebookF className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </a>
                  <a 
                    href="mailto:hello@danamotech.com" 
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200 group"
                  >
                    <MdEmail className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900 transition-colors duration-200 group"
                  >
                    <FaInstagram className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-pink-600 dark:group-hover:text-pink-400" />
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200 group"
                  >
                    <FaLinkedinIn className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-700 dark:group-hover:text-blue-300" />
                  </a>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">Company</h4>
              <ul className="space-y-4">
                <li>
                  <Link 
                    href="/about" 
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/careers" 
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/services" 
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                  >
                    Our Services
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/team" 
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                  >
                    Our Team
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">Resources</h4>
              <ul className="space-y-4">
                <li>
                  <Link 
                    href="/blog" 
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                  >
                    Blog & Insights
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/faqs" 
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/webinars" 
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                  >
                    Webinars & Events
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/help-center" 
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">Legal</h4>
              <ul className="space-y-4">
                <li>
                  <Link 
                    href="/privacy" 
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/terms" 
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/cookies" 
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                  >
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/accessibility" 
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                  >
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
                &copy; 2025 Danamo Tech. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Made with</span>
                <span className="text-red-500 animate-pulse">❤️</span>
                <span>in Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
