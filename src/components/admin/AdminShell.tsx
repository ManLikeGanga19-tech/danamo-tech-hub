"use client";

import { ReactNode, useEffect, useState } from "react";
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
  Menu,
  MessageSquare,
  Users,
  X,
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
  const [navOpen, setNavOpen] = useState(false);

  // Mobile drawer: close on Escape and lock page scroll while it is open.
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setNavOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [navOpen]);

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
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center gap-3 px-4 bg-white/95 dark:bg-[#1E1E2F]/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={() => setNavOpen(true)}
          aria-label="Open navigation"
          aria-expanded={navOpen}
          aria-controls="admin-sidebar"
          className="-ml-2 p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-lg font-bold text-gray-900 dark:text-white truncate">
          Danamo <span className="text-blue-600 dark:text-blue-400">Admin</span>
        </span>
      </header>

      {/* Drawer backdrop (mobile only) */}
      {navOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="admin-sidebar"
        className={`w-64 max-w-[85vw] bg-white dark:bg-[#1E1E2F] border-r border-gray-200 dark:border-gray-800 flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-200 lg:translate-x-0 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-14 lg:h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Danamo <span className="text-blue-600 dark:text-blue-400">Admin</span>
          </span>
          <button
            type="button"
            onClick={() => setNavOpen(false)}
            aria-label="Close navigation"
            className="lg:hidden -mr-2 p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
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

      <main className="flex-1 min-w-0 lg:ml-64 min-h-screen pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
