"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  FileText,
  FolderKanban,
  Handshake,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  MessageSquare,
  Users,
} from "lucide-react";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { adminPath, toAppPath } from "@/lib/admin/paths";

const sidebarLinks = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Contact Messages", path: "/messages", icon: MessageSquare },
  { name: "Careers", path: "/careers", icon: Briefcase },
  { name: "Webinars", path: "/webinars", icon: Users },
  { name: "Projects", path: "/projects", icon: FolderKanban },
  { name: "Blog", path: "/blog", icon: FileText },
  { name: "Partners", path: "/partners", icon: Handshake },
  { name: "Newsletter", path: "/newsletter", icon: Mail },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAdminAuth();
  const appPath = toAppPath(usePathname());
  const isLoginPage = appPath === "/login";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      window.location.href = adminPath("/login");
    }
  }, [loading, user, isLoginPage]);

  // The login page never waits for the session check.
  if (isLoginPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0e0e15]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0e0e15]">
      <aside className="w-64 bg-white dark:bg-[#1E1E2F] border-r border-gray-200 dark:border-gray-800 flex flex-col fixed inset-y-0 z-50">
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Danamo <span className="text-blue-600 dark:text-blue-400">Admin</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = appPath === link.path;
            return (
              <a
                key={link.name}
                href={adminPath(link.path)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
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
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center font-bold">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.email}</span>
              <span className="text-xs text-gray-500 capitalize">{user.role}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
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
