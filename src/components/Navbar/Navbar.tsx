"use client";

import { usePathname } from "next/navigation";
import { AppwriteException, Models } from "appwrite";
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
import { account, databases} from "@/lib/appwriteServices"; // Added databases import

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
                {
                    title: "Web Development",
                    icon: <Code2 />,
                    description: "Custom website and web app development",
                    url: "/services",
                },
                {
                    title: "SEO & Marketing",
                    icon: <Zap />,
                    description: "Grow your brand with our digital marketing",
                    url: "/services",
                },
                {
                    title: "Branding & UX/UI Design",
                    icon: <Brush />,
                    description: "Visually engaging and user-friendly designs",
                    url: "/services",
                },
                {
                    title: "Cloud & DevOps",
                    icon: <ServerCog />,
                    description: "Streamlined deployment and cloud infrastructure",
                    url: "/services",
                },
                {
                    title: "SaaS Product Development",
                    icon: <Package />,
                    description: "Scalable SaaS platforms for your business",
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
    const [profileVerified, setProfileVerified] = useState<boolean | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const currentUser = await account.get();
                setUser(currentUser);

                try {
                    const profile = await databases.getDocument(
                        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                        process.env.NEXT_PUBLIC_APPWRITE_USER_PROFILE_COLLECTION_ID!,
                        currentUser.$id
                    );
                    setProfileVerified(!!profile.profileSetup);
                } catch (err: unknown) { 
                    if (err instanceof AppwriteException) {
                        console.error("Profile fetch error:", err.message, err.code, err.type);
                    } else {
                        console.error("Unexpected profile fetch error:", err);
                    }
                    setProfileVerified(false);
                }
            } catch (err: unknown) { 
                if (err instanceof AppwriteException) {
                    console.log("No session:", err.message, err.code, err.type);
                } else {
                    console.log("Unexpected session error:", err);
                }
                setUser(null);
                setProfileVerified(null);
            } finally {
                setLoading(false);
            }
        };

        if (window.location.href.includes("provider=")) {
            setTimeout(checkSession, 300);
        } else {
            checkSession();
        }
    }, []);

    const handleLogout = async () => {
        try {
            await account.deleteSession("current");
            setUser(null);
            setDropdownOpen(false);
            window.location.href = "/login";
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const closeDropdown = () => setDropdownOpen(false);

    const renderMenuItem = (item: MenuItem) => {
        const isActive = pathname === item.url;
        return item.items ? (
            <NavigationMenuItem key={item.title}>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white/70 dark:bg-black/50 backdrop-blur-lg popover-rounded shadow-lg p-4 min-w-[280px] border">
                    {item.items.map((sub) => (
                        <NavigationMenuLink asChild key={sub.title} className="w-full">
                            <SubMenuLink item={sub} />
                        </NavigationMenuLink>
                    ))}
                </NavigationMenuContent>
            </NavigationMenuItem>
        ) : (
            <NavigationMenuItem key={item.title}>
                <NavigationMenuLink
                    href={item.url}
                    className={`group inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${isActive
                        ? "bg-muted font-semibold text-blue-600 dark:text-blue-400"
                        : "hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-blue-400"}`}
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
                <AccordionTrigger className="py-0 text-md font-semibold hover:no-underline">
                    {item.title}
                </AccordionTrigger>
                <AccordionContent className="mt-2">
                    {item.items.map((sub) => (
                        <SubMenuLink key={sub.title} item={sub} />
                    ))}
                </AccordionContent>
            </AccordionItem>
        ) : (
            <a
                key={item.title}
                href={item.url}
                className={`text-md font-semibold ${isActive ? "text-blue-600 dark:text-blue-400 font-bold" : "hover:text-blue-600 dark:hover:text-blue-400"}`}
            >
                {item.title}
            </a>
        );
    };

    return (
        <section className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900 shadow-sm">
            <div className="layout container py-3">
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
                                    className="border-2 rounded-full border-blue-600"
                                    aria-label="User menu"
                                >
                                    <Image src={user.prefs?.avatar || "/avatar.jpg"} alt="Avatar" width={32} height={32} className="rounded-full" />
                                </button>
                                {dropdownOpen && (
                                    <div
                                        onBlur={closeDropdown}
                                        tabIndex={0}
                                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                                    >
                                        <div className="py-1">
                                            <a
                                                href="/account"
                                                onClick={closeDropdown}
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <UserCircle className="inline w-4 h-4 mr-2" />
                                                Account Settings
                                            </a>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 flex items-center text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <LogOut className="inline w-4 h-4 mr-2" />
                                                Logout
                                            </button>
                                        </div>
                                        {profileVerified !== null && (
                                            <div className="px-4 pt-2 pb-3">
                                                <div className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-md ${profileVerified
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
                            <div className="flex items-center gap-2">
                                <Button asChild size="sm" variant="outline" className="w-full bg-white text-blue-600 border border-blue-600 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                                >
                                    <a href={auth.login.url}>{auth.login.title}</a>
                                </Button>
                                <Button asChild size="sm" className="w-full bg-blue-600 border-blue-600 text-white transition-colors duration-300 ease-in-out hover:bg-blue-700 hover:text-white dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                                >
                                    <a href={auth.signup.url}>{auth.signup.title}</a>
                                </Button>
                            </div>
                        )}
                    </div>
                </nav>

                <div className="block lg:hidden">
                    <div className="flex items-center justify-between">
                        <Logo className="text-lg" />
                        <div className="flex items-center gap-3">
                            {!loading && user && (
                                <div className="relative">
                                    <button
                                        onClick={toggleDropdown}
                                        className="border-2 rounded-full border-blue-600"
                                        aria-label="User menu"
                                    >
                                        <Image src={user.prefs?.avatar || "/avatar.jpg"} alt="Avatar" width={32} height={32} className="rounded-full" />
                                    </button>
                                    {dropdownOpen && (
                                        <div
                                            onBlur={closeDropdown}
                                            tabIndex={0}
                                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                                        >
                                            <div className="py-1">
                                                <a href="/account" onClick={closeDropdown} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <UserCircle className="inline w-4 h-4 mr-2" />
                                                    Account Settings
                                                </a>
                                                <button onClick={handleLogout} className="w-full text-left px-4 py-2 flex items-center text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <LogOut className="inline w-4 h-4 mr-2" />
                                                    Logout
                                                </button>
                                            </div>
                                            {profileVerified !== null && (
                                                <div className="px-4 pt-2 pb-3">
                                                    <div className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-md ${profileVerified
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
                            )}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Menu className="size-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="overflow-y-auto transition-transform duration-300 ease-in-out bg-gradient-to-b from-white to-gray-100 dark:from-[#0e0e15] dark:to-[#1E1E2F]">
                                    <SheetHeader>
                                        <SheetTitle><Logo className="text-lg" /></SheetTitle>
                                    </SheetHeader>
                                    <Accordion type="single" collapsible className="flex w-full flex-col gap-4">
                                        {menu.map(renderMobileMenuItem)}
                                    </Accordion>
                                    <div className="flex items-center gap-6 mt-4">
                                        <Button variant="outline" size="icon" onClick={toggleTheme}>
                                            {theme === "dark" ? <Sun /> : <Moon />}
                                        </Button>
                                        {!user && (
                                            <>
                                                <Button asChild size="sm" variant="outline" className="w-full bg-white text-blue-600 border border-blue-600 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                                                >
                                                    <a href={auth.login.url}>{auth.login.title}</a>
                                                </Button>
                                                <Button asChild size="sm" className="w-full bg-blue-600 border-blue-600 text-white transition-colors duration-300 ease-in-out hover:bg-blue-700 hover:text-white dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                                                >
                                                    <a href={auth.signup.url}>{auth.signup.title}</a>
                                                </Button>
                                            </>
                                        )}
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
        <a href={item.url} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            {item.icon}
            <div className="flex flex-col">
                <span className="font-semibold">{item.title}</span>
                {item.description && <span className="text-sm text-muted-foreground">{item.description}</span>}
            </div>
        </a>
    );
}
