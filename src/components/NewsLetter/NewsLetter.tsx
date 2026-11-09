"use client"

import React, { useState } from 'react'
import { CalendarDays, Hand, BellIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth/AuthContext"
import { apiFetch } from "@/lib/api/client"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const { user, loading } = useAuth()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!user) {
      setError("Please log in to subscribe.")
      return
    }

    if (!email) {
      setError("Email is required.")
      return
    }

    try {
      await apiFetch<{ status: string }>("/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
      })
      setSuccess("Subscribed successfully!")
      setEmail("")
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to subscribe."
      setError(errorMessage.replace(/^API \d+: /, ""))
    }
  }

  return (
    <section className="w-full py-24 transition-colors duration-700 bg-gradient-to-b from-white to-gray-50 dark:from-[#1E1E2F] dark:to-[#0e0e15] overflow-hidden">
      <div className="layout w-full max-w-[85rem] mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white">
            Subscribe to our <span className="text-blue-600 dark:text-blue-400">Newsletter</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get the latest updates on cutting-edge tech innovations, product launches, and exclusive insights straight to your inbox.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Form */}
          <div className="w-full">
            <div className="bg-white dark:bg-[#1E1E2F] p-8 md:p-10 rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-100 dark:border-gray-800">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Stay ahead of the curve.
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Join our community of innovators and business leaders.
              </p>

              <div className="w-full space-y-4">
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-md">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 rounded-md">
                    <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
                  </div>
                )}
                
                <form id="newsletter-form" onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-full">
                    <Label htmlFor="email-address" className="sr-only">
                      Email address
                    </Label>
                    <Input
                      id="email-address"
                      name="email"
                      type="email"
                      required
                      placeholder="Enter your work email"
                      autoComplete="email"
                      className="w-full rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder:text-gray-400 h-14 px-4 text-base focus:ring-2 focus:ring-blue-600"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!user || loading}
                    />
                  </div>
                  
                  {user ? (
                    <Button
                      asChild
                      className="w-full sm:w-auto flex-none h-14 rounded-xl px-8 text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-600/20"
                    >
                      <button type="submit" form="newsletter-form" disabled={loading}>
                        Subscribe
                        <BellIcon size={18} className="ml-2 animate-pulse" />
                      </button>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="w-full sm:w-auto flex-none h-14 rounded-xl px-8 text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-600/20"
                    >
                      <a href="/login">Log in to Subscribe</a>
                    </Button>
                  )}
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  We care about your data in our privacy policy.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Features */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start p-6 rounded-2xl bg-white dark:bg-[#1E1E2F] border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-500/10 shrink-0">
                <CalendarDays aria-hidden="true" className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Weekly articles</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Explore curated articles on tech trends, software tips, and startup strategies delivered weekly.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start p-6 rounded-2xl bg-white dark:bg-[#1E1E2F] border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-500/10 shrink-0">
                <Hand aria-hidden="true" className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No spam, ever.</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Your time is valuable. We send only high-quality updates when it matters most.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}