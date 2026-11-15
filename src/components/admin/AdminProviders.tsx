"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AdminAuthProvider } from "@/lib/admin/AdminAuthContext";

export default function AdminProviders({ children }: { children: ReactNode }) {
  return (
    // Own storage key: the admin's light/dark choice never touches the public site.
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="danamo-admin-theme">
      <AdminAuthProvider>
        {children}
        <Toaster richColors position="top-center" />
      </AdminAuthProvider>
    </ThemeProvider>
  );
}
