"use client";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-3 py-1 rounded-xl ring-1 ring-black/10 dark:ring-white/10"
        >
            Toggle Theme
        </button>
    );
}
