"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch } from "@/lib/api/client";

type PopoverState = null | "welcome" | "greeting";

export default function WelcomeCard() {
  const [show, setShow] = React.useState<PopoverState>(null);
  const { user, loading, refresh } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (loading) return;
    if (!user) { setShow(null); return; }
    if (pathname !== "/" && pathname !== "/dashboard") { setShow(null); return; }

    const isProfileIncomplete = !user.full_name;
    if (isProfileIncomplete && !user.has_seen_welcome) {
      setShow("welcome");
    } else if (!isProfileIncomplete && !user.has_seen_greeting) {
      setShow("greeting");
    } else {
      setShow(null);
    }
  }, [user, loading, pathname]);

  const flagSeen = async (key: "has_seen_welcome" | "has_seen_greeting") => {
    try {
      await apiFetch("/auth/me", {
        method: "PATCH",
        body: JSON.stringify({ [key]: true }),
      });
      await refresh();
    } catch (err) {
      console.error("Failed to update user flags:", err);
    } finally {
      setShow(null);
    }
  };

  const handleMaybeLater = () => flagSeen("has_seen_welcome");

  const handleGoToSettings = async () => {
    await flagSeen("has_seen_welcome");
    router.push("/account");
  };

  const handleCloseGreeting = () => flagSeen("has_seen_greeting");

  if (!show) return null;

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
              <motion.div key="spinner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center space-y-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </motion.div>
            ) : show === "welcome" ? (
              <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
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
              <motion.div key="greeting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                <h3 className="text-lg font-semibold mb-2">
                  Hello, {user?.full_name || "there"}! 🎉
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
  );
}