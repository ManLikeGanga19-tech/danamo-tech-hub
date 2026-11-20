import { Facebook, Instagram, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { CONTACT_EMAIL, SOCIAL_LINKS } from '@/lib/site'
import { publishedLocations } from '@/lib/locations'
import CookiePreferencesButton from './CookiePreferencesButton'

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full pt-16 pb-8 transition-colors duration-700 bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F] border-t border-gray-200 dark:border-gray-800">
      <div className="layout w-full max-w-[85rem] mx-auto px-4 md:px-8">

        {/* Top Section: Logo, Description, Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10 lg:gap-8 mb-12 md:mb-16">

          {/* Brand & Social Column (Takes up 2 columns on large screens) */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 flex flex-col items-start">
            <Link href="/" className="mb-6 inline-block">
              <Image
                src="/nav-img.jpg"
                alt="Danamo Tech Logo"
                width={135}
                height={45}
                sizes="135px"
                className="object-contain"
              />
            </Link>
            <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-sm leading-relaxed">
              Bridging the technology gap for businesses and startups. We deliver enterprise-grade web, software, and digital solutions.
            </p>

            {/* Social Icons — only profiles configured in src/lib/site.ts */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.facebook && (
                <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Danamo Tech on Facebook" className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#1E1E2F] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:border-blue-600 dark:hover:text-blue-400 dark:hover:border-blue-400 transition-all duration-300">
                  <Facebook className="w-4 h-4" aria-hidden="true" />
                </a>
              )}
              <a href={`mailto:${CONTACT_EMAIL}`} aria-label={`Email ${CONTACT_EMAIL}`} className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#1E1E2F] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-red-500 hover:border-red-500 dark:hover:text-red-400 dark:hover:border-red-400 transition-all duration-300">
                <Mail className="w-5 h-5" aria-hidden="true" />
              </a>
              {SOCIAL_LINKS.instagram && (
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Danamo Tech on Instagram" className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#1E1E2F] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-pink-500 hover:border-pink-500 dark:hover:text-pink-400 dark:hover:border-pink-400 transition-all duration-300">
                  <Instagram className="w-4 h-4" aria-hidden="true" />
                </a>
              )}
              {SOCIAL_LINKS.linkedin && (
                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Danamo Tech on LinkedIn" className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#1E1E2F] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-blue-700 hover:border-blue-700 dark:hover:text-blue-500 dark:hover:border-blue-500 transition-all duration-300">
                  <Linkedin className="w-4 h-4" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase mb-6 text-gray-900 dark:text-white">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Careers</Link></li>
              <li><Link href="/services" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Services</Link></li>
              <li><Link href="/team" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Our Founder</Link></li>
              {publishedLocations.map((loc) => (
                <li key={loc.slug}><Link href={`/locations/${loc.slug}`} className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{loc.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase mb-6 text-gray-900 dark:text-white">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="/blog" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</Link></li>
              <li><Link href="/faqs" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQs</Link></li>
              <li><Link href="/webinars" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Webinars &amp; Events</Link></li>
              <li><Link href="/help-center" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase mb-6 text-gray-900 dark:text-white">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/accessibility" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Accessibility</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookies Policy</Link></li>
              <li><CookiePreferencesButton className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" /></li>
              <li><Link href="/terms" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            &copy; <span suppressHydrationWarning>{currentYear}</span> Danamo Tech. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}