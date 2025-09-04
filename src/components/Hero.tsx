"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-[78vh] w-full">
            {/* Hafif bir genel overlay: okunabilirlik (isteğe bağlı, kaldırabilirsin) */}
            <div className="pointer-events-none absolute inset-0 z-[15] bg-black/10" />

            {/* ORTA HİZALI İÇERİK */}
            <div className="relative z-20 mx-auto flex min-h-[78vh] max-w-4xl flex-col items-center justify-center px-6 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-balance text-4xl font-semibold leading-tight text-white md:text-5xl"
                >
                    Strategic PM · Digital Marketing · Creative Producer
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.05 }}
                    className="mt-4 max-w-2xl text-pretty text-white/85"
                >
                    Ölçülebilir iş hedeflerine odaklanan; yaratıcı üretim, kampanya
                    kurgusu ve veri odaklı pazarlama.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="mt-8 flex flex-wrap items-center justify-center gap-3"
                >
                    <a
                        href="#work"
                        className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow hover:shadow-md"
                    >
                        Projelerimi Gör
                    </a>
                    <a
                        href="/cv.pdf"
                        className="rounded-xl border border-white/25 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
                    >
                        CV İndir
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="mt-6 flex items-center justify-center gap-4"
                >
                    <a
                        href="mailto:yagmurcemgul@example.com"
                        className="group inline-flex items-center gap-2 text-white/90 hover:text-white"
                    >
                        <Mail size={18} />
                        <span className="text-sm">Mail</span>
                    </a>
                    <a
                        href="https://github.com/yagmurcemgul1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-white/90 hover:text-white"
                    >
                        <Github size={18} />
                        <span className="text-sm">GitHub</span>
                    </a>
                    <a
                        href="https://www.linkedin.com/in/yagmurcemgul"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-white/90 hover:text-white"
                    >
                        <Linkedin size={18} />
                        <span className="text-sm">LinkedIn</span>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
