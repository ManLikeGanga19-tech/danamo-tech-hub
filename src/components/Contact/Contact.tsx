"use client";

import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

function Contact() {
  return (
    <section
      className="w-full py-[15px] transition-colors duration-700 bg-gradient-to-b from-gray-100 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]"
    >
      <div className="grid lg:grid-cols-2 items-center gap-14 sm:p-8 p-4">
        {/* Contact Info */}
        <div>
          <h1 className="text-4xl text-center font-semibold text-blue-600 dark:text-blue-400">
            Contact <span className='text-black dark:text-white'>Us</span>
          </h1>
          <p className="text-lg text-black dark:text-white mt-6 leading-relaxed">
            Have some big idea or brand to develop and need help? Then reach out we&apos;d love to hear about your project and provide help.
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
        </div>

        {/* Contact Form Card */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md border-blue-400">
            <CardHeader>
              <CardDescription>Fill out the form and we will get back to you shortly.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid w-full gap-4">
                {/* Name */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name" className='text-blue-600 dark:text-blue-400'>Name</Label>
                  <Input id="name" placeholder="Your full name" />
                </div>

                {/* Email */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email" className='text-blue-600 dark:text-blue-400'>Email</Label>
                  <Input type="email" id="email" placeholder="you@example.com" />
                </div>

                {/* Interest Dropdown */}
                <div className="flex flex-col space-y-1.5 ">
                  <Label htmlFor="interest" className='text-blue-600 dark:text-blue-400'>I am interested in...</Label>
                  <Select>
                    <SelectTrigger id="interest" >
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent className='bg-gray-100  dark:text-white dark:bg-[#1E1E2F]'>
                      <SelectItem value="web" className='hover:text-blue-600'>Web Development</SelectItem>
                      <SelectItem value="seo" className='hover:text-blue-600'>Search Engine Optimization</SelectItem>
                      <SelectItem value="branding" className='hover:text-blue-600'>Branding & UI/UX Design</SelectItem>
                      <SelectItem value="marketing" className='hover:text-blue-600'>Social media & Digital Marketing</SelectItem>
                      <SelectItem value="ecommerce" className='hover:text-blue-600'>E-Commerce</SelectItem>
                      <SelectItem value="consuting" className='hover:text-blue-600'>IT Consulting and Support</SelectItem>
                      <SelectItem value="saas" className='hover:text-blue-600'>SaaS Product Development</SelectItem>
                      <SelectItem value="cloud" className='hover:text-blue-600'>Cloud & DevOps</SelectItem>

                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="message" className='text-blue-600 dark:text-blue-400'>Message</Label>
                  <Textarea id="message" placeholder="Tell us more about your project..." rows={4} />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button {...({ type: "submit" } as React.ButtonHTMLAttributes<HTMLButtonElement>)} className="bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
              >
                <Send size={12} className='animate-pulse'/>
                Send Message
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default Contact;
