"use client";

import React from "react";
import PillNav from "@/components/PillNav";

export default function AboutPage() {
    return (
        <main className="relative min-h-screen bg-black text-white">
            {/* NAV */}
            <PillNav
                logo="/logo.png"
                logoAlt="YCG"
                items={[
                    { label: "Welcome",  href: "/" },
                    { label: "Projects",  href: "/projects" },
                    { label: "Portfolio", href: "/stalker" },
                    { label: "About",    href: "/about" },
                    { label: "Blog",     href: "/blog" },
                ]}
                activeHref="/about"
                baseColor="#000000"
                pillColor="#ffffff"
                hoveredPillTextColor="#ffffff"
                pillTextColor="#000000"
                initialLoadAnimation
            />

            {/* İçerik */}
            <section className="mx-auto w-full max-w-3xl px-5 pt-28 pb-16">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    About Me
                </h1>
                <p className="text-white/85 leading-relaxed mb-6">
                    Merhaba! Ben Yagmur Cem Gul. Project Management, Digital Marketing,
                    Game Development ve Creative Production alanlarında projeler üretiyorum.
                    Ürün ve içerik odaklı ekiplerle çalışmayı, yaratıcı fikirleri hızlıca
                    deneyip somut çıktılara dönüştürmeyi seviyorum.
                </p>

                <h2 className="text-2xl md:text-3xl font-semibold mt-10 mb-3">Skills</h2>
                <ul className="list-disc pl-5 space-y-2 text-white/90">
                    <li>Project &amp; Product Management, Roadmap &amp; Delivery</li>
                    <li>Digital Marketing (Performance, Content, Growth)</li>
                    <li>Game Dev (Prototyping, small tools, Unity/JS)</li>
                    <li>Creative Producing, Script &amp; Asset Pipeline</li>
                </ul>

                <h2 className="text-2xl md:text-3xl font-semibold mt-10 mb-3">Approach</h2>
                <p className="text-white/85 leading-relaxed">
                    İşleri basit tutmayı, hızlı iterasyonla ilerlemeyi ve ölçülebilir
                    hedefler koymayı tercih ederim. Kullanıcı geri bildirimi, analitik ve
                    ekip içi iletişim benim için kritik.
                </p>
            </section>

            <style>{`
        /* Nav'ın üstte görünmesi için içerikte üst boşluk verdik (pt-28) */
        main { overflow-x: hidden; }
      `}</style>
        </main>
    );
}
