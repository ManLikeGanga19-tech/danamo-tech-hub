"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Menu,
    Moon,
    Sun,
    Zap,
    Brush,
    ServerCog,
    Package,
    Code2,
    LogOut,
    UserCircle,
    X,
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
    title: string;
    url: string;
    description?: string;
    icon?: React.ReactNode;
    items?: MenuItem[];
}

interface Navbar1Props {
    menu?: MenuItem[];
    auth?: {
        login: { title: string; url: string };
        signup: { title: string; url: string };
    };
}

export const Navbar1 = ({
    menu = [
        {
            title: "Services",
            url: "/services",
            items: [
                { title: "Web Development", icon: <Code2 />, description: "Custom website and web app development", url: "/services" },
                { title: "SEO & Marketing", icon: <Zap />, description: "Grow your brand with our digital marketing", url: "/services" },
                { title: "Branding & UX/UI Design", icon: <Brush />, description: "Visually engaging and user-friendly designs", url: "/services" },
                { title: "Cloud & DevOps", icon: <ServerCog />, description: "Streamlined deployment and cloud infrastructure", url: "/services" },
                { title: "SaaS Product Development", icon: <Package />, description: "Scalable SaaS platforms for your business", url: "/services" },
            ],
        },
        { title: "Blog", url: "/blog" },
        { title: "About", url: "/about" },
        { title: "Webinars", url: "/webinars" },
    ],
    auth = {
        login: { title: "Login", url: "/login" },
        signup: { title: "Sign up", url: "/signup" },
    },
}: Navbar1Props) => {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const { user, loading, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        setDropdownOpen(false);
        setIsMobileMenuOpen(false);
        window.location.href = "/login";
    };

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const closeDropdown = () => setDropdownOpen(false);

    const avatarSrc = user?.avatar_url || "/avatar.jpg";
    const profileVerified: boolean | null = user ? !!user.full_name : null;

    const renderMenuItem = (item: MenuItem) => {
        const isActive = pathname === item.url;
        return item.items ? (
            <NavigationMenuItem key={item.title}>
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 data-[state=open]:text-blue-600 dark:data-[state=open]:text-blue-400 px-4 py-2 text-sm font-medium transition-colors">
                    {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white dark:bg-[#1E1E2F] shadow-xl shadow-blue-500/5 dark:shadow-black/50 border border-gray-100 dark:border-gray-800 rounded-2xl p-3 min-w-[340px] mt-2">
                    <div className="flex flex-col gap-1">
                        {item.items.map((sub) => (
                            <NavigationMenuLink asChild key={sub.title} className="w-full">
                                <SubMenuLink item={sub} />
                            </NavigationMenuLink>
                        ))}
                    </div>
                </NavigationMenuContent>
            </NavigationMenuItem>
        ) : (
            <NavigationMenuItem key={item.title}>
                <NavigationMenuLink
                    href={item.url}
                    className={`group inline-flex h-10 items-center justify-center px-4 py-2 text-sm font-medium transition-colors ${
                        isActive
                            ? "text-blue-600 dark:text-blue-400 font-semibold"
                            : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                >
                    {item.title}
                </NavigationMenuLink>
            </NavigationMenuItem>
        );
    };

    const renderMobileMenuItem = (item: MenuItem) => {
        const isActive = pathname === item.url;
        return item.items ? (
            <AccordionItem key={item.title} value={item.title} className="border-b-0">
                <AccordionTrigger className="py-4 text-lg font-semibold hover:no-underline text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {item.title}
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                    <div className="flex flex-col gap-2">
                        {item.items.map((sub) => (
                            <div key={sub.title} onClick={() => setIsMobileMenuOpen(false)}>
                                <SubMenuLink item={sub} />
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        ) : (
            <a
                key={item.title}
                href={item.url}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-4 text-lg font-semibold transition-colors ${
                    isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                }`}
            >
                {item.title}
            </a>
        );
    };

    return (
        <>
            {/* Sticky Navbar Section - NO backdrop-blur to avoid breaking fixed children */}
            <section className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 shadow-sm border-b border-gray-100 dark:border-gray-800">
                <div className="layout container py-3">
                    <nav className="hidden lg:flex justify-between items-center">
                        {/* Clickable Desktop Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <Image src="/nav-img.jpg" alt="Danamo Tech Logo" width={140} height={40} className="h-10 w-auto object-contain cursor-pointer" priority />
                        </Link>

                        <div className="flex items-center ml-auto">
                            <NavigationMenu>
                                <NavigationMenuList>{menu.map((item) => renderMenuItem(item))}</NavigationMenuList>
                            </NavigationMenu>
                        </div>
                        <div className="flex items-center gap-6 ml-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleTheme}
                                aria-label="Toggle theme"
                                className="flex items-center justify-center transition-colors duration-300 ease-in-out border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </Button>
                            {loading ? null : user ? (
                                <div className="relative">
                                    <button
                                        onClick={toggleDropdown}
                                        className="border-2 rounded-full border-blue-600 hover:border-blue-700 transition-colors"
                                        aria-label="User menu"
                                    >
                                        <Image src={avatarSrc} alt="Avatar" width={32} height={32} className="rounded-full object-cover" />
                                    </button>
                                    {dropdownOpen && (
                                        <div
                                            onBlur={closeDropdown}
                                            tabIndex={0}
                                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 border border-gray-100 dark:border-gray-700 overflow-hidden"
                                        >
                                            <div className="py-1">
                                                <a
                                                    href="/account"
                                                    onClick={closeDropdown}
                                                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <UserCircle className="inline w-4 h-4 mr-2" />
                                                    Account Settings
                                                </a>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2.5 flex items-center text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                >
                                                    <LogOut className="inline w-4 h-4 mr-2" />
                                                    Logout
                                                </button>
                                            </div>
                                            {profileVerified !== null && (
                                                <div className="px-4 pt-2 pb-3 border-t border-gray-100 dark:border-gray-700">
                                                    <div className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-md ${
                                                        profileVerified
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                    }`}>
                                                        {profileVerified ? "Verified" : "Not Verified"}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Button asChild size="sm" variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                                        <a href={auth.login.url}>{auth.login.title}</a>
                                    </Button>
                                    <Button asChild size="sm" className="bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-lg">
                                        <a href={auth.signup.url}>{auth.signup.title}</a>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Navbar Top Bar */}
                    <div className="block lg:hidden">
                        <div className="flex items-center justify-between">
                            {/* Clickable Mobile Logo */}
                            <Link href="/" className="flex-shrink-0">
                                <Image src="/nav-img.jpg" alt="Danamo Tech Logo" width={140} height={40} className="h-10 w-auto object-contain cursor-pointer" priority />
                            </Link>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={toggleTheme}
                                    aria-label="Toggle theme"
                                    className="border-gray-200 dark:border-gray-700"
                                >
                                    {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                </Button>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="border-gray-200 dark:border-gray-700"
                                    onClick={() => setIsMobileMenuOpen(true)}
                                    aria-label="Open menu"
                                >
                                    <Menu className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile Menu Drawer - MOVED OUTSIDE the sticky section to fix fixed positioning */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Dark Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 z-[100] lg:hidden"
                        />

                        {/* Sliding Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white dark:bg-[#0e0e15] z-[101] shadow-2xl overflow-y-auto flex flex-col lg:hidden"
                        >
                            <div className="p-6 flex flex-col min-h-full">
                                {/* Drawer Header */}
                                <div className="flex items-center justify-between mb-8">
                                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Image src="/nav-img.jpg" alt="Danamo Tech Logo" width={140} height={40} className="h-10 w-auto object-contain cursor-pointer" />
                                    </Link>
                                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                                        <X className="w-6 h-6 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" />
                                    </Button>
                                </div>

                                {/* Drawer Links */}
                                <Accordion type="single" collapsible className="flex w-full flex-col gap-1">
                                    {menu.map(renderMobileMenuItem)}
                                </Accordion>

                                {/* Drawer Profile / Auth */}
                                <div className="flex flex-col gap-4 mt-auto pt-8 border-t border-gray-200 dark:border-gray-800">
                                    {!loading && user ? (
                                        <>
                                            <div className="flex items-center gap-4 px-2 mb-2">
                                                <Image src={avatarSrc} alt="Avatar" width={48} height={48} className="rounded-full border-2 border-blue-600 object-cover" />
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900 dark:text-white">{user.full_name || "User"}</span>
                                                    <span className="text-sm text-gray-500">{user.email}</span>
                                                </div>
                                            </div>
                                            <Button asChild variant="ghost" className="w-full justify-start h-12 text-base text-gray-700 dark:text-gray-300">
                                                <a href="/account" onClick={() => setIsMobileMenuOpen(false)}>
                                                    <UserCircle className="inline w-5 h-5 mr-3" /> Account Settings
                                                </a>
                                            </Button>
                                            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start h-12 text-base text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                                                <LogOut className="inline w-5 h-5 mr-3" /> Logout
                                            </Button>
                                        </>
                                    ) : !loading && !user ? (
                                        <div className="flex flex-col gap-3">
                                            <Button asChild size="lg" variant="outline" className="w-full h-12 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                                                <a href={auth.login.url}>{auth.login.title}</a>
                                            </Button>
                                            <Button asChild size="lg" className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700">
                                                <a href={auth.signup.url}>{auth.signup.title}</a>
                                            </Button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

function SubMenuLink({ item }: { item: MenuItem }) {
    return (
        <a href={item.url} className="flex items-start gap-4 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors mt-0.5 shrink-0">
                {item.icon}
            </div>
            <div className="flex flex-col text-left">
                <span className="font-semibold text-sm text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                </span>
                {item.description && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {item.description}
                    </span>
                )}
            </div>
        </a>
    );
}