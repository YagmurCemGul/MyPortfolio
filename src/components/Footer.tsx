import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-16 border-t border-black/10 dark:border-white/10">
            <div className="max-w-6xl mx-auto px-4 py-6 text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="opacity-70">© {new Date().getFullYear()} Yagmur Cem Gul</p>
                <nav className="flex items-center gap-4">
                    <Link href="https://wa.me/905386520339" target="_blank" rel="noopener noreferrer">WhatsApp</Link>
                    <Link href="https://calendly.com/yagmurcemgul" target="_blank" rel="noopener noreferrer">Calendly</Link>
                    <Link href="https://github.com/yagmurcemgul1" target="_blank" rel="noopener noreferrer">GitHub</Link>
                    <Link href="https://www.linkedin.com/in/yagmurcemgul/" target="_blank" rel="noopener noreferrer">LinkedIn</Link>
                </nav>
            </div>
        </footer>
    );
}
