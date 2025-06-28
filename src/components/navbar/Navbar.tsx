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
                <NavigationMenuTrigger className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg p-4 min-w-[320px]">
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
                    className={`group inline-flex h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${isActive
                        ? "bg-blue-100 font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300"
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
            <AccordionItem key={item.title} value={item.title} className="border-b border-gray-200 dark:border-gray-700">
                <AccordionTrigger className="py-3 text-lg font-semibold hover:no-underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                    {item.title}
                </AccordionTrigger>
                <AccordionContent className="mt-2 pb-4">
                    <div className="space-y-2">
                        {item.items.map((sub) => (
                            <SubMenuLink key={sub.title} item={sub} mobile />
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        ) : (
            <div key={item.title} className="py-2">
                <a
                    href={item.url}
                    className={`block text-lg font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ${isActive ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 font-bold" : "hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                >
                    {item.title}
                </a>
            </div>
        );
    };

    return (
        <section className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="layout container py-3 lg:py-4">
                <nav className="hidden lg:flex justify-between items-center">
                    <Logo className="text-xl" />
                    <div className="flex items-center ml-auto">
                        <NavigationMenu>
                            <NavigationMenuList className="gap-1">{menu.map((item) => renderMenuItem(item))}</NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    <div className="flex items-center gap-4 ml-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="flex items-center justify-center transition-all duration-300 ease-in-out border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
                        >
                            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </Button>
                        {loading ? (
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                        ) : user ? (
                            <div className="relative">
                                <button
                                    onClick={toggleDropdown}
                                    className="border-2 rounded-full border-blue-500 hover:border-blue-600 dark:border-blue-400 dark:hover:border-blue-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                                    aria-label="User menu"
                                >
                                    <Image src={user.prefs?.avatar || "/avatar.jpg"} alt="Avatar" width={32} height={32} className="rounded-full" />
                                </button>
                                {dropdownOpen && (
                                    <div
                                        onBlur={closeDropdown}
                                        tabIndex={0}
                                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 border border-gray-200 dark:border-gray-700 focus:outline-none"
                                    >
                                        <div className="py-2">
                                            <a
                                                href="/account"
                                                onClick={closeDropdown}
                                                className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                                            >
                                                <UserCircle className="inline w-4 h-4 mr-3" />
                                                Account Settings
                                            </a>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-3 flex items-center text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                                            >
                                                <LogOut className="inline w-4 h-4 mr-3" />
                                                Logout
                                            </button>
                                        </div>
                                        {profileVerified !== null && (
                                            <div className="px-4 pb-3">
                                                <div className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${profileVerified
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                    }`}>
                                                    {profileVerified ? "✓ Verified" : "⚠ Not Verified"}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Button asChild size="sm" variant="outline" className="font-medium bg-white text-blue-600 border-blue-600 transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-600 dark:hover:text-white"
                                >
                                    <a href={auth.login.url}>{auth.login.title}</a>
                                </Button>
                                <Button asChild size="sm" className="font-medium bg-blue-600 border-blue-600 text-white transition-all duration-300 ease-in-out hover:bg-blue-700 hover:shadow-md dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600"
                                >
                                    <a href={auth.signup.url}>{auth.signup.title}</a>
                                </Button>
                            </div>
                        )}
                    </div>
                </nav>

                <div className="block lg:hidden">
                    <div className="flex items-center justify-between">
                        <Logo className="text-xl" />
                        <div className="flex items-center gap-3">
                            {!loading && user && (
                                <div className="relative">
                                    <button
                                        onClick={toggleDropdown}
                                        className="border-2 rounded-full border-blue-500 hover:border-blue-600 dark:border-blue-400 dark:hover:border-blue-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                                        aria-label="User menu"
                                    >
                                        <Image src={user.prefs?.avatar || "/avatar.jpg"} alt="Avatar" width={28} height={28} className="rounded-full" />
                                    </button>
                                    {dropdownOpen && (
                                        <div
                                            onBlur={closeDropdown}
                                            tabIndex={0}
                                            className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 border border-gray-200 dark:border-gray-700 z-50"
                                        >
                                            <div className="py-2">
                                                <a href="/account" onClick={closeDropdown} className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                                    <UserCircle className="inline w-4 h-4 mr-3" />
                                                    Account Settings
                                                </a>
                                                <button onClick={handleLogout} className="w-full text-left px-4 py-3 flex items-center text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                                    <LogOut className="inline w-4 h-4 mr-3" />
                                                    Logout
                                                </button>
                                            </div>
                                            {profileVerified !== null && (
                                                <div className="px-4 pb-3">
                                                    <div className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${profileVerified
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                        }`}>
                                                        {profileVerified ? "✓ Verified" : "⚠ Not Verified"}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon" className="border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-200">
                                        <Menu className="size-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="w-80 sm:w-96 overflow-y-auto transition-transform duration-300 ease-in-out bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-l border-gray-200 dark:border-gray-700">
                                    <SheetHeader className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                                        <SheetTitle><Logo className="text-xl" /></SheetTitle>
                                    </SheetHeader>
                                    <Accordion type="single" collapsible className="flex w-full flex-col gap-2">
                                        {menu.map(renderMobileMenuItem)}
                                    </Accordion>
                                    <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <Button variant="outline" size="sm" onClick={toggleTheme} className="flex items-center gap-2 justify-center border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400">
                                            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                                        </Button>
                                        {!user && (
                                            <div className="flex flex-col gap-3">
                                                <Button asChild size="sm" variant="outline" className="font-medium bg-white text-blue-600 border-blue-600 transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-600 dark:hover:text-white"
                                                >
                                                    <a href={auth.login.url}>{auth.login.title}</a>
                                                </Button>
                                                <Button asChild size="sm" className="font-medium bg-blue-600 border-blue-600 text-white transition-all duration-300 ease-in-out hover:bg-blue-700 hover:shadow-md dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600"
                                                >
                                                    <a href={auth.signup.url}>{auth.signup.title}</a>
                                                </Button>
                                            </div>
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

function SubMenuLink({ item, mobile = false }: { item: MenuItem; mobile?: boolean }) {
    return (
        <a 
            href={item.url} 
            className={`flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 group ${mobile ? 'ml-4' : ''}`}
        >
            <div className="text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
                {item.icon}
            </div>
            <div className="flex flex-col">
                <span className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
                    {item.title}
                </span>
                {item.description && (
                    <span className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                        {item.description}
                    </span>
                )}
            </div>
        </a>
    );
}
