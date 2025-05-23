"use client";

import { usePathname } from "next/navigation";
import { Book, Menu, Moon, Sun, Zap } from "lucide-react";
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

interface MenuItem {
    title: string;
    url: string;
    description?: string;
    icon?: React.ReactNode;
    items?: MenuItem[];
}

interface Navbar1Props {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
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
    logo = {
        url: "/",
        src: "/logo.png",
        alt: "Logo",
        title: "Danamo Tech Hub",
    },
    menu = [
        { title: "Home", url: "/" },
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
                    <NavigationMenuContent className="min-w-[320px] bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300 ease-in-out">
                        {item.items.map((subItem) => (
                            <NavigationMenuLink asChild key={subItem.title}>
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
                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors duration-300 ease-in-out ${isActive
                            ? "bg-muted font-semibold text-primary"
                            : "hover:bg-gray-100 hover:text-black dark:hover:bg-gray-800 dark:hover:text-white"
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
                className={`text-md font-semibold transition-colors duration-300 ease-in-out ${isActive ? "text-primary font-bold" : "hover:text-black dark:hover:text-white"
                    }`}
            >
                {item.title}
            </a>
        );
    };

    return (
        <section className="sticky top-0 z-50 bg-white dark:bg-black shadow-sm transition-colors duration-300">
            <div className="container py-4">
                {/* Desktop Menu */}
                <nav className="hidden justify-between lg:flex">
                    <div className="flex items-center gap-6">
                        <a href={logo.url} className="flex items-center gap-2">
                            <img src={logo.src} className="max-h-8" alt={logo.alt} />
                            <span className="text-lg font-semibold tracking-tighter">
                                {logo.title}
                            </span>
                        </a>
                        <div className="flex items-center">
                            <NavigationMenu>
                                <NavigationMenuList>
                                    {menu.map((item) => renderMenuItem(item))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="flex items-center justify-center transition-colors duration-300 ease-in-out"
                        >
                            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </Button>

                        <Button
                            asChild
                            size="sm"
                            className="bg-white text-black border border-black transition-colors duration-300 ease-in-out hover:bg-black hover:text-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
                        >
                            <a href={auth.login.url}>{auth.login.title}</a>
                        </Button>
                        <Button
                            asChild
                            size="sm"
                            className="bg-black text-white transition-colors duration-300 ease-in-out hover:bg-white hover:text-black dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
                        >
                            <a href={auth.signup.url}>{auth.signup.title}</a>
                        </Button>
                    </div>
                </nav>

                {/* Mobile Menu */}
                <div className="block lg:hidden">
                    <div className="flex items-center justify-between">
                        <a href={logo.url} className="flex items-center gap-2">
                            <img src={logo.src} className="max-h-8" alt={logo.alt} />
                        </a>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="size-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-y-auto transition-transform duration-300 ease-in-out bg-white dark:bg-black text-black dark:text-white">
                                <SheetHeader>
                                    <SheetTitle>
                                        <a href={logo.url} className="flex items-center gap-2">
                                            <img src={logo.src} className="max-h-8" alt={logo.alt} />
                                        </a>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-6 p-4">
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="flex w-full flex-col gap-4"
                                    >
                                        {menu.map((item) => renderMobileMenuItem(item))}
                                    </Accordion>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={toggleTheme}
                                            aria-label="Toggle theme"
                                            className="flex items-center justify-center transition-colors duration-300 ease-in-out"
                                        >
                                            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                        </Button>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="bg-white text-black border border-black transition-colors duration-300 ease-in-out hover:bg-black hover:text-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
                                        >
                                            <a href={auth.login.url}>{auth.login.title}</a>
                                        </Button>
                                        <Button
                                            asChild
                                            className="bg-black text-white transition-colors duration-300 ease-in-out hover:bg-white hover:text-black dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
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
            className="flex min-w-[320px] flex-row gap-4 rounded-md p-3 leading-none no-underline select-none transition-colors duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white"
            href={item.url}
        >
            <div className="text-inherit">{item.icon}</div>
            <div>
                <div className="text-sm font-semibold">{item.title}</div>
                {item.description && (
                    <p className="text-sm leading-snug text-muted-foreground">
                        {item.description}
                    </p>
                )}
            </div>
        </a>
    );
};
