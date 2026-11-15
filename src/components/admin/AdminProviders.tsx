"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AdminAuthProvider } from "@/lib/admin/AdminAuthContext";

export default function AdminProviders({ children }: { children: ReactNode }) {
  return (
    // Same look as the public site, but its own storage key: the admin's
    // light/dark choice never touches the public site.
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem storageKey="danamo-admin-theme">
      <AdminAuthProvider>
        {children}
        <Toaster richColors position="top-center" />
      </AdminAuthProvider>
    </ThemeProvider>
  );
}
