"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { adminFetch } from "./client";

type AdminUser = { id: string; email: string; full_name: string | null; role: string; };
type AdminAuthContextValue = { user: AdminUser | null; loading: boolean; logout: () => Promise<void>; };

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<AdminUser>("/auth/me")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await adminFetch("/auth/logout", { method: "POST" });
    setUser(null);
    const isLocalhost = window.location.hostname === "localhost";
    window.location.href = isLocalhost ? "/admin/login" : "/login";
  };

  return (
    <AdminAuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside <AdminAuthProvider>");
  return ctx;
}