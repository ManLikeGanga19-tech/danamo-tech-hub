'use client'

import { CalendarDays, Hand, BellIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Newsletter() {
  return (
    <section
      className="w-full py-[15px] transition-colors duration-700 bg-gradient-to-b from-white to-gray-100 dark:from-[#1E1E2F] dark:to-[#0e0e15] "
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h3 className="text-2xl p-4 font-semibold tracking-tight text-black dark:text-white text-center">
              Subscribe to our <span className='text-blue-600 dark:text-blue-400'>newsletter</span>
            </h3>
            <p className="mt-4 text-lg text-black dark:text-white text-center">
              Get the latest updates on cutting edge tech innovations, product launches, and exclusive insights from our team - straight to your inbox
            </p>

            {/* Centered and Responsive Form */}
            <div className="mt-6 flex justify-center">
              <div className="flex w-full max-w-md flex-col sm:flex-row items-center gap-4">
                <Label htmlFor="email-address" className="sr-only">
                  Email address
                </Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full sm:flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-blue-600 placeholder:text-gray-900 dark:placeholder:text-white focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
                <Button
                  {...({ type: "submit" } as React.ButtonHTMLAttributes<HTMLButtonElement>)}
                  className="w-full sm:w-auto flex-none rounded-md px-3.5 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                >
                  Subscribe
                  <BellIcon size={16} className='animate-pulse' />
                </Button>
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <div className="flex flex-col items-start">
              <div className="rounded-md dark:bg-white/5 p-2 ring-1 dark:ring-white/10">
                <CalendarDays aria-hidden="true" className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
              <dt className="mt-4 text-base font-semibold text-black dark:text-white">Weekly articles</dt>
              <dd className="mt-2 text-base/7 text-gray-800 dark:text-white">
                Explore curated articles on tech trends, software tips, and startup strategies delivered weekly              </dd>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md dark:bg-white/5 p-2 ring-1 dark:ring-white/10">
                <Hand aria-hidden="true" className="size-6 text-blue-600 dark:text-blue" />
              </div>
              <dt className="mt-4 text-base font-semibold text-black dark:text-white">No spam</dt>
              <dd className="mt-2 text-base/7 text-gray-800 dark:text-white">
                Your time is valuable. We send only high-quality updates when it matters most
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
