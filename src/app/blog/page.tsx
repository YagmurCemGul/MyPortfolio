import type { Metadata } from "next";
import PillNav from "@/components/PillNav";
import React from "react";

export const metadata: Metadata = {
    title: "Blog | Yagmur Cem Gul",
    description: "Yazılarım ve notlarım",
};

export default function BlogPage() {
    return (
        <main className="relative min-h-screen bg-black text-white">
            {/* NAV */}
            <PillNav
                logo="/logo.png"
                logoAlt="YCG"
                items={[
                    { label: "Welcome", href: "/" },
                    { label: "About",   href: "/about" },
                    { label: "Projects", href: "/projects" },
                    { label: "Portfolio", href: "/stalker" },
                    { label: "Blog",    href: "/blog" },
                ]}
                activeHref="/blog"
                baseColor="#000000"
                pillColor="#ffffff"
                hoveredPillTextColor="#ffffff"
                pillTextColor="#000000"
                initialLoadAnimation
            />

            <section style={{ padding: "120px 16px 64px", maxWidth: 900, margin: "0 auto" }}>
                <h1 style={{ margin: 0, fontSize: "clamp(24px,4vw,36px)" }}>Blog</h1>
                <p style={{ opacity: .85, marginTop: 8 }}>
                    Yazılarımı burada toplayacağım. (Sonradan gerçek içerikle değiştirebilirsin.)
                </p>

                <div style={{ marginTop: 24, display: "grid", gap: 16 }}>
                    <article style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 16,
                        padding: 16,
                        color: "#fff"
                    }}>
                        <h3 style={{ margin: 0 }}>İlk Yazı</h3>
                        <p style={{ marginTop: 8, opacity: .9 }}>Kısa özet…</p>
                    </article>

                    <article style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 16,
                        padding: 16,
                        color: "#fff"
                    }}>
                        <h3 style={{ margin: 0 }}>İkinci Yazı</h3>
                        <p style={{ marginTop: 8, opacity: .9 }}>Kısa özet…</p>
                    </article>
                </div>
            </section>
            <style>{`
        /* Nav'ın üstte görünmesi için içerikte üst boşluk verdik (pt-28) */
        main { overflow-x: hidden; }
      `}</style>
        </main>
    );
}
