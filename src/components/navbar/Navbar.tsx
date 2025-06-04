"use client";

import { usePathname } from "next/navigation";
import { Account, Models } from "appwrite";
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
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useTheme } from "@/hooks/useTheme";
import { Logo } from "@/components/Logo";
import { useState, useEffect } from "react";
import Image from "next/image";
import { appwriteClient } from "@/lib/appwriteServices";

// Define Appwrite User type
type User = Models.User<Models.Preferences>;

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
        login: {
            title: string;
            url: string;
        };
        signup: {
            title: string;
            url: string;
        };
    };
}

export const Navbar1 = ({
    menu = [
        {
            title: "Services",
            url: "/services",
            items: [
                {
                    title: "Web Development",
                    description: "Custom website and web app development",
                    icon: <Code2 className="size-5 shrink-0" />,
                    url: "/services",
                },
                {
                    title: "SEO & Marketing",
                    description: "Grow your brand with our digital marketing",
                    icon: <Zap className="size-5 shrink-0" />,
                    url: "/services",
                },
                {
                    title: "Branding & UX/UI Design",
                    description: "Visually engaging and user-friendly designs",
                    icon: <Brush className="size-5 shrink-0" />,
                    url: "/services",
                },
                {
                    title: "Cloud & DevOps",
                    description: "Streamlined deployment and cloud infrastructure",
                    icon: <ServerCog className="size-5 shrink-0" />,
                    url: "/services",
                },
                {
                    title: "SaaS Product Development",
                    description: "Scalable SaaS platforms for your business",
                    icon: <Package className="size-5 shrink-0" />,
                    url: "/services",
                },
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
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const account = new Account(appwriteClient);

    // Fetch current user session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const currentUser = await account.get();
                setUser(currentUser);
            } catch (error) {
                console.log("No active session:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, [account]); // Fix: Include `account` in dependency array

    // Handle logout
    const handleLogout = async () => {
        try {
            await account.deleteSession("current");
            setUser(null);
            setDropdownOpen(false);
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // Debug user state
    useEffect(() => {
        console.log("Navbar user:", user, "Loading:", loading);
    }, [user, loading]);

    const renderMenuItem = (item: MenuItem) => {
        const isActive = pathname === item.url;

        if (item.items) {
            return (
                <NavigationMenuItem key={item.title}>
                    <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-white/70 dark:bg-black/50 backdrop-blur-lg text-popover-foreground rounded-lg shadow-lg p-4 min-w-[280px] transition-all duration-300 ease-in-out border border-gray-300 dark:border-gray-700">
                        {item.items.map((subItem) => (
                            <NavigationMenuLink asChild key={subItem.title} className="w-full">
                                <SubMenuLink item={subItem} />
                            </NavigationMenuLink>
                        ))}
                    </NavigationMenuContent>
                </NavigationMenuItem>
            );
        }

        return (
            <NavigationMenuItem key={item.title}>
                <NavigationMenuLink
                    href={item.url}
                    className={`group inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors duration-300 ease-in-out ${isActive
                        ? "bg-muted font-semibold text-blue-600 dark:text-blue-400"
                        : "hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                        }`}
                >
                    {item.title}
                </NavigationMenuLink>
            </NavigationMenuItem>
        );
    };

    const renderMobileMenuItem = (item: MenuItem) => {
        const isActive = pathname === item.url;

        if (item.items) {
            return (
                <AccordionItem key={item.title} value={item.title} className="border-b-0">
                    <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
                        {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="mt-2">
                        {item.items.map((subItem) => (
                            <SubMenuLink key={subItem.title} item={subItem} />
                        ))}
                    </AccordionContent>
                </AccordionItem>
            );
        }

        return (
            <a
                key={item.title}
                href={item.url}
                className={`text - md font - semibold transition - colors duration - 300 ease -in -out ${isActive
                        ? "text-blue-600 dark:text-blue-400 font-bold"
                        : "hover:text-blue-600 dark:hover:text-blue-400"
                    } `}
            >
                {item.title}
            </a>
        );
    };

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const closeDropdown = () => setDropdownOpen(false);

    return (
        <section className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200 ease">
            <div className="layout container py-3">
                {/* Desktop Menu */}
                <nav className="hidden lg:flex justify-between items-center">
                    <Logo className="text-lg" />
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
                            className="flex items-center justify-center transition-colors duration-300 ease-in-out border-blue-600"
                        >
                            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </Button>
                        {loading ? null : user ? (
                            <div className="relative">
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center rounded-full border-2 border-blue-600"
                                    aria-label="User menu"
                                >
                                    <Image
                                        src={user.prefs?.avatar || "/avatar.jpg"}
                                        alt="User Avatar"
                                        height={32}
                                        width={32}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                </button>
                                {dropdownOpen && (
                                    <div
                                        onBlur={closeDropdown}
                                        tabIndex={0}
                                        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                                    >
                                        <div className="py-1">
                                            <a
                                                href="/account"
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                onClick={closeDropdown}
                                            >
                                                <UserCircle className="inline w-4 h-4 mr-2" />
                                                Account Settings
                                            </a>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text- gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                            >
                                                <LogOut className="inline w-4 h-4 mr-2" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button
                                    asChild
                                    size="sm"
                                    className="bg-white text-blue-600 border border-blue-600 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                                >
                                    <a href={auth.login.url}>{auth.login.title}</a>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className="bg-blue-600 border-blue-600 text-white transition-colors duration-300 ease-in-out hover:bg-blue-700 hover:text-white dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                                >
                                    <a href={auth.signup.url}>{auth.signup.title}</a>
                                </Button>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu */}
                <div className="block lg:hidden">
                    <div className="flex items-center justify-between">
                        <Logo className="text-lg" />
                        <div className="flex items-center gap-3">
                            {loading ? null : user ? (
                                <div className="relative">
                                    <button
                                        onClick={toggleDropdown}
                                        className="flex items-center rounded-full border-2 border-blue-600"
                                        aria-label="User menu"
                                    >
                                        <Image
                                            src={user.prefs?.avatar || "/avatar.jpg"}
                                            alt="User Avatar"
                                            width={32}
                                            height={32}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    </button>
                                    {dropdownOpen && (
                                        <div
                                            onBlur={closeDropdown}
                                            tabIndex={0}
                                            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                                        >
                                            <div className="py-1">
                                                <a
                                                    href="/account"
                                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    onClick={closeDropdown}
                                                >
                                                    <UserCircle className="inline w-4 h-4 mr-2" />
                                                    Account Settings
                                                </a>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                                >
                                                    <LogOut className="inline w-4 h-4 mr-2" />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Button asChild size="sm" className="hidden">
                                        <a href={auth.login.url}>{auth.login.title}</a>
                                    </Button>
                                </>
                            )}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon" className="border-blue-600 hover:bg-blue-600">
                                        <Menu className="size-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="overflow-y-auto transition-transform duration-300 ease-in-out bg-gradient-to-b from-white to-gray-100 dark:from-[#0e0e15] dark:to-[#1E1E2F]">
                                    <SheetHeader>
                                        <SheetTitle>
                                            <Logo className="text-lg" />
                                        </SheetTitle>
                                    </SheetHeader>
                                    <div className="flex flex-col gap-6 p-4">
                                        <Accordion type="single" collapsible className="flex w-full flex-col gap-4">
                                            {menu.map((item) => renderMobileMenuItem(item))}
                                        </Accordion>
                                        <div className="flex items-center gap-6">
                                            <Button
                                                variant="outline"
                                                onClick={toggleTheme}
                                                aria-label="Toggle theme"
                                                className="flex border-blue-600 items-center justify-center transition-colors duration-300 ease-in-out"
                                            >
                                                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                            </Button>
                                            {loading ? null : !user && (
                                                <>
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        className="w-full bg-white text-blue-600 border border-blue-600 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                                                    >
                                                        <a href={auth.login.url}>{auth.login.title}</a>
                                                    </Button>
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        className="w-full bg-blue-600 border-blue-600 text-white transition-colors duration-300 ease-in-out hover:bg-blue-700 hover:text-white dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                                                    >
                                                        <a href={auth.signup.url}>{auth.signup.title}</a>
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

function SubMenuLink({ item }: { item: MenuItem }) {
    return (
        <a
            href={item.url}
            className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
            {item.icon}
            <div className="flex flex-col">
                <span className="font-semibold">{item.title}</span>
                {item.description && <span className="text-sm text-muted-foreground">{item.description}</span>}
            </div>
        </a>
    );
}
