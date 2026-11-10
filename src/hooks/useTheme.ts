import { useTheme as useNextTheme } from "next-themes";

export function useTheme() {
    const { resolvedTheme, setTheme } = useNextTheme();

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    return {
        theme: (resolvedTheme || "light") as "light" | "dark",
        toggleTheme,
    };
}