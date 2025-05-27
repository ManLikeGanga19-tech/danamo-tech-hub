'use client';

import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

function Contact() {
  return (
    <section
      className="w-full py-[15px] transition-colors duration-700 bg-gradient-to-b from-gray-100 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]"
     >
      <div className="grid lg:grid-cols-2 items-center gap-14 sm:p-8 p-4">
        <div>
          <h1 className="text-4xl font-semibold text-blue-600 dark:text-blue-400"> Contact <span className='text-black dark:text-white'>Us</span></h1>
          <p className="text-lg text-black dark:text-white mt-6 leading-relaxed">
            {"Have some big idea or brand to develop and need help? Then reach out we&apos;d love to hear about your project and provide help."}
          </p>

          <ul className="mt-12 space-y-8">
            <li className="flex items-center">
              <Mail className="text-blue-600 dark:text-blue-400" size={20} />
              <a href="mailto:info@example.com" className="text-black dark:text-white text-sm ml-4 hover:no-underline">
                info@example.com
              </a>
            </li>
            <li className="flex items-center">
              <Phone className="text-blue-600 dark:text-blue-400" size={20} />
              <a href="tel:+254797233957" className="text-black dark:text-white text-sm ml-4 hover:no-underline">
                +254797233957
              </a>
            </li>
            <li className="flex items-center">
              <MapPin className="text-blue-600 dark:text-blue-400" size={20} />
              <span className="text-black dark:text-white text-sm ml-4">
                123 Street, 254 House
              </span>
            </li>
          </ul>

          {/* Optional: Add social icons here later if you want */}

        </div>

        {/* You can add a form or an image here */}
        <div className="h-64 bg-[#3d015b] rounded-md flex items-center justify-center text-white text-lg">
          Contact Form or Image Placeholder
        </div>
      </div>
    </section>
  );
}

export default Contact;
