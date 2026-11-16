"use client";

import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AdminAuthProvider } from "@/lib/admin/AdminAuthContext";

export default function AdminProviders({ children }: { children: ReactNode }) {
  return (
    // Light theme only, like the public site: no theme provider.
    <AdminAuthProvider>
      {children}
      <Toaster richColors position="top-center" />
    </AdminAuthProvider>
  );
}
