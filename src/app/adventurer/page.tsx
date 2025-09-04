"use client";

import dynamic from "next/dynamic";
import Script from "next/script";
import PillNav from "@/components/PillNav";

// Arkaplandaki yıldızlar
const Stars = dynamic(() => import("@/components/Stars"), { ssr: false });

export default function AdventurerHome() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundColor: "#000000",
        backgroundImage: "url(/hero/nyan.gif)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 50%",
        backgroundSize: "60%",
      }}
    >
      {/* PillNav-style logo (click → /intro) */}
      <div className="relative z-30">
        <PillNav
          logo="/logo.png"
          logoAlt="YCG"
          logoHref="/intro"
          items={[]}
          activeHref="/adventurer"
          baseColor="#000000"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
        />
      </div>

      {/* Lordicon loader once */}
      <Script src="https://cdn.lordicon.com/lordicon.js" strategy="afterInteractive" />

      <Stars />

      <section className="relative z-10 min-h-[60vh]" aria-hidden="true" />

      <section className="relative z-20 flex flex-col items-center justify-start gap-8 px-6 pb-16 text-center">
        <a
          href=""
          className="rounded-xl bg-white px-6 py-3 text-sm md:text-base font-medium text-zinc-900 shadow hover:shadow-md"
        >
          Contact Me
        </a>

        {/* Social icon grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 place-items-center">
          {/* WhatsApp */}
          <a href="https://wa.me/905386520339" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <lord-icon
              src="https://cdn.lordicon.com/lzhauhfx.json"
              trigger="hover"
              stroke="bold"
              state="hover-draw"
              style={{ width: 24, height: 24 }}
            />
          </a>

          {/* LinkedIn */}
          <a href="http://www.linkedin.com/in/yagmurcemgul" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <lord-icon
              src="https://cdn.lordicon.com/bnzbstbp.json"
              trigger="hover"
              stroke="bold"
              state="hover-draw"
              style={{ width: 24, height: 24 }}
            />
          </a>

          {/* Behance */}
          <a href="https://www.behance.net/yagmurcemgul" target="_blank" rel="noopener noreferrer" aria-label="Behance">
            <lord-icon
              src="https://cdn.lordicon.com/ahywxkbh.json"
              trigger="hover"
              stroke="bold"
              state="hover-draw"
              style={{ width: 24, height: 24 }}
            />
          </a>

          {/* YouTube */}
          <a href="https://www.youtube.com/@rispeacebell" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <lord-icon
              src="https://cdn.lordicon.com/vcgyhoyv.json"
              trigger="morph"
              stroke="bold"
              state="morph-logotype"
              style={{ width: 24, height: 24 }}
            />
          </a>

          {/* GitHub */}
          <a href="https://github.com/YagmurCemGul1" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <lord-icon
              src="https://cdn.lordicon.com/acgiczyg.json"
              trigger="hover"
              stroke="bold"
              state="loop-roll"
              style={{ width: 24, height: 24 }}
            />
          </a>

        

          {/* Email */}
          <a href="mailto:yagmurcemgul@gmail.com" aria-label="Email">
            <lord-icon
              src="https://cdn.lordicon.com/gejrxhkx.json"
              trigger="morph"
              stroke="bold"
              state="morph-close"
              style={{ width: 24, height: 24 }}
            />
          </a>

          {/* Instagram */}
          <a href="https://www.instagram.com/yagmurcemgul/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <lord-icon
              src="https://cdn.lordicon.com/xxfmfkoa.json"
              trigger="hover"
              stroke="bold"
              state="hover-rotate"
              style={{ width: 24, height: 24 }}
            />
          </a>
        </div>
      </section>
    </main>
  );
}
