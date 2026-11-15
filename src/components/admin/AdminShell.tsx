"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Briefcase,
  FolderKanban,
  Handshake,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  MessageSquare,
  Moon,
  Sun,
  Users,
} from "lucide-react";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { adminPath, toAppPath } from "@/lib/admin/paths";

const sidebarLinks = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Contact Messages", path: "/messages", icon: MessageSquare },
  { name: "Career Applications", path: "/careers", icon: Briefcase },
  { name: "Webinars", path: "/webinars", icon: Users },
  { name: "Projects", path: "/projects", icon: FolderKanban },
  { name: "Partners", path: "/partners", icon: Handshake },
  { name: "Newsletter", path: "/newsletter", icon: Mail },
];

function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-9" />;

  const isDark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-slate-800 transition-colors"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAdminAuth();
  const appPath = toAppPath(usePathname());
  const isLoginPage = appPath === "/login";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      window.location.href = adminPath("/login");
    }
  }, [loading, user, isLoginPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (isLoginPage) return <>{children}</>;
  if (!user) return null;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed inset-y-0 z-50">
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-wide text-slate-900 dark:text-white">DANAMO</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              Console
            </span>
          </span>
          <ThemeSwitch />
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
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 flex items-center justify-center font-bold">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.email}</span>
              <span className="text-xs text-slate-500 capitalize">{user.role}</span>
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
