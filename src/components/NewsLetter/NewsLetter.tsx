"use client"

import React, { useState, useEffect } from 'react'
import { CalendarDays, Hand, BellIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { account, appwriteClient } from "@/lib/appwriteServices"
import { Models, Databases, ID } from "appwrite"

export default function Newsletter() {
  // Form state
  const [email, setEmail] = useState("")
  // User and loading state
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
  const [loading, setLoading] = useState(true)
  // Feedback state
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Check if user is logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await account.get()
        setUser(currentUser)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkSession()
  }, [])

  // Handle form submission
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
      const databases = new Databases(appwriteClient)
      await databases.createDocument(
        "6840196a001ea51cd944", // appwrite Database ID
        "68406feb00364a7418b0", // newsletterCollection ID
        ID.unique(),
        {
          userID: user.$id,
          email,
          createdAt: new Date().toISOString(),
        }
      )
      setSuccess("Subscribed successfully!")
      setEmail("")
    } catch (err: unknown) {
      console.error("Appwrite database error:", JSON.stringify(err, null, 2))
      const errorMessage = err instanceof Error ? err.message : "Failed to subscribe."
      setError(errorMessage)
    }
  }

  return (
    <section
      className="relative w-full py-16 sm:py-20 lg:py-24 transition-colors duration-700 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950/20 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Subscribe to our{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  newsletter
                </span>
              </h3>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Get the latest updates on cutting-edge tech innovations, product launches, and exclusive insights from our team — straight to your inbox.
              </p>
            </div>

            {/* Enhanced Form */}
            <div className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}
              {success && (
                <div className="p-4 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium">{success}</p>
                </div>
              )}
              
              <form id="newsletter-form" onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-4">
                <div className="flex-1">
                  <Label htmlFor="email-address" className="sr-only">
                    Email address
                  </Label>
                  <Input
                    id="email-address"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email address"
                    autoComplete="email"
                    className="h-12 text-base border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white/80 dark:bg-gray-800/80"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!user || loading}
                  />
                </div>
                {user ? (
                  <button
                    type="submit"
                    form="newsletter-form"
                    disabled={loading}
                    className="h-12 px-6 text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transition-all duration-300 ease-in-out dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    Subscribe
                    <BellIcon size={16} />
                  </button>
                ) : (
                  <Button
                    asChild
                    size="lg"
                    className="h-12 px-6 text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transition-all duration-300 ease-in-out dark:bg-blue-500 dark:hover:bg-blue-600 whitespace-nowrap"
                  >
                    <a href="/login">Log in to Subscribe</a>
                  </Button>
                )}
              </form>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center lg:text-left">
                Join 1,000+ subscribers. Unsubscribe at any time.
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <div className="flex flex-col items-start space-y-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
                <CalendarDays aria-hidden="true" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <dt className="text-lg font-bold text-gray-900 dark:text-gray-100">Weekly Articles</dt>
              <dd className="text-base leading-7 text-gray-600 dark:text-gray-300">
                Explore curated articles on tech trends, software tips, and startup strategies delivered weekly.
              </dd>
            </div>
            <div className="flex flex-col items-start space-y-4">
              <div className="flex items-center justify-center w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-800">
                <Hand aria-hidden="true" className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <dt className="text-lg font-bold text-gray-900 dark:text-gray-100">No Spam</dt>
              <dd className="text-base leading-7 text-gray-600 dark:text-gray-300">
                Your time is valuable. We send only high-quality updates when it matters most.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}