'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter, usePathname } from 'next/navigation'
import { account, databases } from '@/lib/appwriteServices'
import { Query } from 'appwrite'
import { Loader2 } from 'lucide-react'

// Define type for show state
type PopoverState = null | 'welcome' | 'greeting'

export default function WelcomeCard() {
  const [show, setShow] = React.useState<PopoverState>(null) // Explicitly type show state
  const [loading, setLoading] = React.useState(true)
  const [userData, setUserData] = React.useState({ firstName: '', lastName: '' })
  const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    const checkUserStatus = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)) // 2s delay

      if (pathname !== '/' && pathname !== '/dashboard') {
        setLoading(false)
        return
      }

      try {
        const user = await account.get()
        const isProfileIncomplete = !user.name || !user.email

        // Fetch profile from user_profiles collection
        const profile = await databases.listDocuments(
          '6840196a001ea51cd944',
          '68482e0c00163d490722',
          [Query.equal('userId', user.$id)]
        )

        let profileData = { firstName: '', lastName: '', profileSetup: false, hasSeenGreeting: false }
        if (profile.documents.length > 0) {
          profileData = {
            firstName: profile.documents[0].firstName || '',
            lastName: profile.documents[0].lastName || '',
            profileSetup: profile.documents[0].profileSetup ?? false, // Handle missing attribute
            hasSeenGreeting: profile.documents[0].hasSeenGreeting ?? false, // Handle missing attribute
          }
        }

        setUserData({ firstName: profileData.firstName, lastName: profileData.lastName })

        // Check if welcome popover should be shown
        const hasDismissedWelcome = user.prefs?.hasSeenWelcome || false
        if (isProfileIncomplete && !hasDismissedWelcome) {
          setShow('welcome')
        }
        // Check if greeting popover should be shown
        else if (profileData.profileSetup && !profileData.hasSeenGreeting) {
          setShow('greeting')
        } else {
          setShow(null)
        }
      } catch (err) {
        console.log('User not logged in or error fetching user:', err)
        setShow(null)
      } finally {
        setLoading(false)
      }
    }

    checkUserStatus()
  }, [pathname])

  const handleMaybeLater = async () => {
    try {
      const user = await account.get()
      await account.updatePrefs({
        ...user.prefs,
        hasSeenWelcome: true,
      })
      setShow(null)
    } catch (err) {
      console.log('Error updating preferences:', err)
      setShow(null)
    }
  }

  const handleGoToSettings = async () => {
    try {
      const user = await account.get()
      await account.updatePrefs({
        ...user.prefs,
        hasSeenWelcome: true,
      })
      setShow(null)
      router.push('/account')
    } catch (err) {
      console.log('Error updating preferences:', err)
      setShow(null)
      router.push('/account')
    }
  }

  const handleCloseGreeting = async () => {
    try {
      const user = await account.get()
      const profile = await databases.listDocuments(
        '6840196a001ea51cd944',
        '68482e0c00163d490722',
        [Query.equal('userId', user.$id)]
      )
      if (profile.documents.length > 0) {
        await databases.updateDocument(
          '6840196a001ea51cd944',
          '68482e0c00163d490722',
          profile.documents[0].$id,
          { hasSeenGreeting: true }
        )
      }
      setShow(null)
    } catch (err) {
      console.log('Error updating profile:', err)
      setShow(null)
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm px-4">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 transition-colors duration-700 bg-gradient-to-b from-gray-100 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F] shadow-xl rounded-2xl min-h-[180px] flex flex-col justify-center items-center">
          <AnimatePresence>
            {loading ? (
              <motion.div
                key="spinner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center space-y-2"
              >
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </motion.div>
            ) : show === 'welcome' ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <h3 className="text-lg font-semibold mb-2">
                  Welcome to <span className="text-blue-600 dark:text-blue-400">Danamo</span> Tech 🎉
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We&apos;re excited to have you here! Let&apos;s get you started by setting up your account in Settings.
                </p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="bg-white text-blue-600 border border-blue-600 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                    onClick={handleMaybeLater}
                  >
                    Maybe Later
                  </Button>
                  <Button
                    onClick={handleGoToSettings}
                    className="bg-blue-600 border-blue-600 text-white transition-colors duration-300 ease-in-out hover:bg-blue-700 hover:text-white dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                  >
                    Go to Settings
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="greeting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <h3 className="text-lg font-semibold mb-2">
                  Hello, {userData.firstName} {userData.lastName}! 🎉
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your account is all set up! Ready to explore <span className="text-blue-600 dark:text-blue-400">Danamo</span> Tech?
                </p>
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={handleCloseGreeting}
                    className="bg-blue-600 border-blue-600 text-white transition-colors duration-300 ease-in-out hover:bg-blue-700 hover:text-white dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                  >
                    Got It
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  )
}
