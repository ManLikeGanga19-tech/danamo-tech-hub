"use client";

import { usePathname } from "next/navigation";
import {
    Book,
    Menu,
    Moon,
    Sun,
    Zap,
    Brush,
    ServerCog,
    Package,
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
                    icon: <Book className="size-5 shrink-0" />,
                    url: "/services/web",
                },
                {
                    title: "SEO & Marketing",
                    description: "Grow your brand with our digital marketing",
                    icon: <Zap className="size-5 shrink-0" />,
                    url: "/services/seo",
                },
                {
                    title: "Branding & UX/UI Design",
                    description: "Visually engaging and user-friendly designs",
                    icon: <Brush className="size-5 shrink-0" />,
                    url: "/services/design",
                },
                {
                    title: "Cloud & DevOps",
                    description: "Streamlined deployment and cloud infrastructure",
                    icon: <ServerCog className="size-5 shrink-0" />,
                    url: "/services/devops",
                },
                {
                    title: "SaaS Product Development",
                    description: "Scalable SaaS platforms for your business",
                    icon: <Package className="size-5 shrink-0" />,
                    url: "/services/saas",
                },
            ],
        },
        { title: "Portfolio", url: "/portfolio" },
        { title: "About", url: "/about" },
        { title: "Contact", url: "/contact" },
    ],
    auth = {
        login: { title: "Login", url: "/login" },
        signup: { title: "Sign up", url: "/signup" },
    },
}: Navbar1Props) => {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

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
                className={`text-md font-semibold transition-colors duration-300 ease-in-out ${isActive
                    ? "text-blue-600 dark:text-blue-400 font-bold"
                    : "hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
            >
                {item.title}
            </a>
        );
    };

    return (
        <section className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="layout container py-3">
                {/* Desktop Menu */}
                <nav className="hidden lg:flex justify-between items-center">
                    {/* Left: Logo */}
                    <Logo className="text-lg" />

                    {/* Center: Menu */}
                    <div className="flex items-center ml-auto">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {menu.map((item) => renderMenuItem(item))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Right: Controls */}
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

                        {/* Auth Buttons */}
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
                                className="bg-blue-600 border-blue-600 text-white transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                            >
                                <a href={auth.signup.url}>{auth.signup.title}</a>
                            </Button>
                        </div>
                    </div>
                </nav>

                {/* Mobile Menu */}
                <div className="block lg:hidden">
                    <div className="flex items-center justify-between">
                        <Logo className="text-lg" />
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="size-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-y-auto transition-transform duration-300 ease-in-out bg-white dark:bg-black text-black dark:text-white">
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
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="bg-white text-blue-600 border border-blue-600 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-black dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                                        >
                                            <a href={auth.login.url}>{auth.login.title}</a>
                                        </Button>
                                        <Button
                                            asChild
                                            className="bg-blue-600 border-blue-600 text-white transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                                        >
                                            <a href={auth.signup.url}>{auth.signup.title}</a>
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </section>
    );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
    return (
        <a
            href={item.url}
            className="flex cursor-pointer select-none items-center rounded-md p-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            <div className="flex flex-col">
                <span className="text-foreground">{item.title}</span>
                {item.description && (
                    <span className="text-muted-foreground text-xs">{item.description}</span>
                )}
            </div>
        </a>
    );
};
