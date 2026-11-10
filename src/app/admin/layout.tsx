"use client";

import { AdminAuthProvider, useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  Users,
  FolderKanban,
  Mail,
  LogOut,
  Loader2,
  Handshake
} from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Contact Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Career Applications", href: "/admin/careers", icon: Briefcase },
  { name: "Webinars", href: "/admin/webinars", icon: Users },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Partners", href: "/admin/partners", icon: Handshake },
  { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAdminAuth();
  const pathname = usePathname();

  const isLoginPage = pathname === "/login" || pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      const isLocalhost = window.location.hostname === "localhost";
      window.location.href = isLocalhost ? "/admin/login" : "/login";
    }
  }, [loading, user, isLoginPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0e0e15]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isLoginPage) return <>{children}</>;
  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0e0e15]">
      <aside className="w-64 bg-white dark:bg-[#1E1E2F] border-r border-gray-200 dark:border-gray-800 flex flex-col fixed inset-y-0 z-50">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Danamo <span className="text-blue-600">Admin</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.email}</span>
              <span className="text-xs text-gray-500 capitalize">{user.role}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}