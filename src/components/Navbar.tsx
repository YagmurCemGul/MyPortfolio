"use client";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur border-b border-black/10 dark:border-white/10">
            <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                <Link href="/" className="font-semibold">Yagmur Cem Gul</Link>
                <div className="flex items-center gap-4 text-sm">
                    <Link href="/projects">Projects</Link>
                    <Link href="/blog">Blog</Link>
                    <Link href="/certificates">Certificates</Link>
                    <ThemeToggle />
                </div>
            </nav>
        </header>
    );
}
