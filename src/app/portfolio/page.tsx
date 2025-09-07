"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PillNav from "@/components/PillNav";
const SECTIONS = ['home', 'about', 'projects', 'blog'] as const;
type TabId = typeof SECTIONS[number];


export default function StalkerPage() {
    // --- 🔧 Hydration fix: sadece mount olduktan sonra rastgele yıldızları üret ---
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const shouldPlayOnUnlock = useRef(false);
    const ejectTimerRef = useRef<number | null>(null);
    const EJECT_SOUND_DELAY_MS = 2500; // 2s gecikme
    const playEject = useCallback(() => {
        try {
            const a = audioRef.current;
            if (!a) return;
            a.currentTime = 0;
            const p = a.play();
            if (p && typeof p.then === 'function') {
                p.catch(() => {
                    // Autoplay engellendiyse bir sonraki kullanıcı etkileşiminde tekrar dene
                    shouldPlayOnUnlock.current = true;
                });
            }
        } catch {}
    }, []);
    const [activeTab, setActiveTab] = useState<TabId>('home');
    


    // Scroll spy için active section'ı takip et
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const others: TabId[] = SECTIONS.slice(1) as TabId[];

            // Home section için özel kontrol (scroll top'ta)
            if (scrollY < 100) {
                setActiveTab('home');
                return;
            }

            // Diğer section'ları kontrol et
            for (const section of others) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        setActiveTab(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // İlk kullanıcı etkileşiminde sesi "unlock" et (autoplay policy)
    useEffect(() => {
        const unlock = () => {
            const a = audioRef.current;
            if (!a) return cleanup();
            // Autoplay iznini almak için kısa bir oynat/durdur denemesi
            const attempt = () => {
                try {
                    const pr = a.play();
                    if (pr && typeof pr.then === 'function') {
                        pr.then(() => {
                            a.pause();
                            a.currentTime = 0;
                            if (shouldPlayOnUnlock.current) {
                                shouldPlayOnUnlock.current = false;
                                // gecikmesiz gerçek çalmayı tetikle
                                a.currentTime = 0;
                                a.play().catch(() => {});
                            }
                            cleanup();
                        }).catch(() => {
                            // yine de temizle, bir sonraki etkileşimde tekrar deneyeceğiz
                            cleanup();
                        });
                    } else {
                        cleanup();
                    }
                } catch { cleanup(); }
            };
            attempt();
        };
        const cleanup = () => {
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
            window.removeEventListener('touchstart', unlock);
        };
        window.addEventListener('pointerdown', unlock);
        window.addEventListener('keydown', unlock);
        window.addEventListener('touchstart', unlock);
        return cleanup;
    }, []);

    // Unmount olduğunda bekleyen ses zamanlayıcısını temizle
    useEffect(() => {
        return () => {
            if (ejectTimerRef.current) {
                clearTimeout(ejectTimerRef.current);
                ejectTimerRef.current = null;
            }
        };
    }, []);


    const stars = useMemo(() => {
        if (!mounted) return []; // SSR aşamasında yıldız render etme (mismatch çözümü)

        return Array.from({ length: 200 }).map((_, i) => {
            const size = Math.floor(Math.random() * 7) + 3;      // 3..9 px
            const dur = Math.floor(Math.random() * 30) + 15;     // 15..45 s
            const delay = -Math.floor(Math.random() * 40);       // -40..0 s
            const top = Math.floor(Math.random() * 102) - 1;     // -1..100 vh
            return (
                <span
                    key={i}
                    className="star"
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        top: `${top}vh`,
                        animationDuration: `${dur}s`,
                        animationDelay: `${delay}s`,
                    }}
                />
            );
        });
    }, [mounted]);


    // — İKİ SATIR — //
    const line1 = "Stalker was ejected.";

    // ← YAZININ BAŞLAMASI İÇİN GENEL DELAY (saniye)
    const TEXT_START_DELAY_S = 4; // örnek: 4s sonra yazmaya başla

    const STEP = 0.05; // harf başına gecikme (sn) — istersen 0.06/0.08 yap
    const makeLetters = (str: string, baseDelay = 0) => {
        const chars = str.split("");
        return chars.map((ch, idx) => {
            const isSpace = ch === " ";
            const delay = baseDelay + idx * STEP; // doğrudan sayıyla hesapla
            return (
                <span
                    key={`${str}-${idx}`}
                    className={isSpace ? "w" : undefined}
                    style={{ animationDelay: `${delay}s` }}  // 👈 inline delay
                >
        {ch}
      </span>
            );
        });
    };

    const lettersLine1 = useMemo(() => makeLetters(line1, TEXT_START_DELAY_S), [TEXT_START_DELAY_S]);


    
    return (
        <div className="root">
            <PillNav
                logo="/logo.png"
                logoAlt="YCG"
                logoHref="/intro"
                items={[

                ]}
                activeHref={activeTab === "home" ? "/stalker" : `#${activeTab}`}
                baseColor="#000000"
                pillColor="#ffffff"
                hoveredPillTextColor="#ffffff"
                pillTextColor="#000000"
            />

            {/* HERO: yıldızlar sadece burada */}
            <section className="hero" id="home">
                {/* Yıldız katmanı */}
                <div className="sky" aria-hidden>
                    {stars}
                </div>

            {/* Ses (Among Us eject) */}
            <audio ref={audioRef} src="/assets/among-us-eject-sound-effect.mp3" preload="auto" playsInline />

            {/* Yazı katmanı */}
            <h1 className="title">
                <span className="line line1">{lettersLine1}</span>
            </h1>

                {/* Crewmate */}
                <div
                    className="boi"
                    aria-hidden
                    onAnimationStart={() => {
                        if (ejectTimerRef.current) {
                            clearTimeout(ejectTimerRef.current);
                            ejectTimerRef.current = null;
                        }
                        ejectTimerRef.current = window.setTimeout(() => {
                            playEject();
                            ejectTimerRef.current = null;
                        }, EJECT_SOUND_DELAY_MS);
                    }}
                    onAnimationEnd={() => {
                        if (ejectTimerRef.current) {
                            clearTimeout(ejectTimerRef.current);
                            ejectTimerRef.current = null;
                        }
                    }}
                >
                    <img
                        className="crewmate"
                        src="https://particles.js.org/images/amongus_cyan.png"
                        alt=""
                        width={207}
                        height={265}
                    />
                </div>

                {/* SVG filter */}
                <svg className="filters" xmlns="http://www.w3.org/2000/svg">
                    <filter id="inset" x="-50%" y="-50%" width="200%" height="200%">
                        <feFlood floodColor="black" result="outside-color" />
                        <feMorphology in="SourceAlpha" operator="dilate" radius="3.5" />
                        <feComposite in="outside-color" operator="in" result="outside-stroke" />
                        <feFlood floodColor="#0c9fc4" result="inside-color" />
                        <feComposite in2="SourceAlpha" operator="in" result="inside-stroke" />
                        <feMerge>
                            <feMergeNode in="outside-stroke" />
                            <feMergeNode in="inside-stroke" />
                        </feMerge>
                    </filter>
                </svg>
            </section>

            {/* PROJECTS: yıldızlı arka plan YOK */}
            <style>{`
            <section id="projects" className="projects-section">
                <div className="container">
                    <h2>Projects</h2>
                    <p>Öne çıkan projelerim.</p>

                    <div className="projects-grid">
                        <article className="project-card">
                            <h3>Project One</h3>
                            <p>Kısa açıklama…</p>
                        </article>
                        <article className="project-card">
                            <h3>Project Two</h3>
                            <p>Kısa açıklama…</p>
                        </article>
                        <article className="project-card">
                            <h3>Project Three</h3>
                            <p>Kısa açıklama…</p>
                        </article>
                    </div>
                </div>
            </section>`}</style>

            {/* İstersen About/Blog bölümlerini de aşağıya koyarsın */}
            <style>{`
      /* --- SCROLL AYARLARI (nav overlap fix) --- */
      html { scroll-behavior: smooth; scroll-padding-top: 96px; }
      #about, #projects, #blog { scroll-margin-top: 96px; }

      /* KÖK: artık tüm sayfa kayabilir */
      .root {
        position: relative;
        min-height: 100vh;   /* << daha önce height:100vh idi */
        background: #000;    /* sayfa zemini koyu kalsın */
        /* ↓↓↓ Stalker başlık (line1) için özelleştirilebilir değişkenler ↓↓↓ */
        --stalker-font-family: Arial, Normal, sans-serif;
        --stalker-font-size-min: 22px;
        --stalker-font-size-vw: 4vw;
        --stalker-font-size-max: 42px;
        --stalker-font-weight: 400;
        --stalker-letter-spacing: 0.02em;
        --stalker-color: #ffffff;
        --stalker-text-shadow: 0 0 12px rgba(0,0,0,0.35);
        /* İsteğe bağlı: stroke/gradient için altyapı (kullanmak için alt kısma bak) */
        --stalker-stroke-size: 0px; /* örn: 1px */
        --stalker-stroke-color: rgba(0,0,0,0.6);
        --stalker-gradient: none; /* örn: linear-gradient(90deg,#ff6,#f06) */
      }

      /* HERO: yıldızlı kısım sadece burada */
      .hero {
        position: relative;
        height: 100vh;       /* tam ekran kahraman alanı */
        overflow: hidden;    /* yıldızlar dışarı taşmasın */
        background: #000;
      }

      /* --- YILDIZLAR (hero içinde) --- */
      .sky { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
      .star {
        position: absolute; left: -12vw; border-radius: 50%;
        background: #fff; box-shadow: 0 0 6px rgba(255,255,255,0.85);
        animation-name: starMoveLR; animation-timing-function: linear; animation-iteration-count: infinite;
        will-change: left; display: inline-block;
      }
      @keyframes starMoveLR { from { left: -12vw; } to { left: 110vw; } }

      /* --- METİN --- */
      .title {
        position: absolute; left: 0; top: 50%; width: 100%;
        transform: translateY(-50%); color: #fff; font-family: arial, sans-serif;
        font-weight: 400; text-align: center; font-size: 20px; z-index: 1;
        margin: 0 auto; padding: 0 16px; pointer-events: none;
        display:flex; flex-direction:column; align-items:center; gap:8px;
      }
      @media (min-width: 600px) { .title { font-size: 30px; } }
      .title span { display:inline-block; opacity:0; animation: letterIn 0.001s steps(1,end) forwards; }
      .title span.w { display:inline; }
      @keyframes letterIn { from{opacity:0} to{opacity:1} }
      .title .line1 {
        font-family: var(--stalker-font-family);
        font-size: clamp(var(--stalker-font-size-min), var(--stalker-font-size-vw), var(--stalker-font-size-max));
        font-weight: var(--stalker-font-weight);
        letter-spacing: var(--stalker-letter-spacing);
        color: var(--stalker-color);
        text-shadow: var(--stalker-text-shadow);
        /* İsteğe bağlı süslemeler: stroke ve gradient metin */
        -webkit-text-stroke: var(--stalker-stroke-size) var(--stalker-stroke-color);
        background: var(--stalker-gradient);
        -webkit-background-clip: text;
        background-clip: text;
      }
      .title .line2 { font-size: clamp(12px, 2vw, 18px); opacity:.95; }

      /* --- CREWMATE --- */
      .boi {
        position: absolute; left: -30vw; top: 55%; transform-origin: center;
        transform: translate3d(0, -45%, 0) rotate(0turn);
        animation: eject 8s linear 1 forwards;
        z-index: 2; pointer-events: none;
      }
      .crewmate { display:block; width: 20vmin; height:auto; pointer-events:none; user-select:none; }
      @keyframes eject {
        0%   { transform: translate3d(0, -45%, 0) rotate(0turn); }
        100% { transform: translate3d(140vw, -45%, 0) rotate(-2turn); }
      }

      .filters { position:absolute; width:0; height:0; pointer-events:none; }

      /* --- PROJECTS (yıldız yok, açık zemin) --- */
      .projects-section {
        position: relative; z-index: 1;
        background: #0b0b0b;        /* arka planı siyah sürdürmek istersen bunu #111/#121212 tut */
        padding: 72px 16px 96px;
        color: #fff;                /* açık zemine geçmek istersen: background:#f7f7f7; color:#111; */
      }
      .container {
        max-width: 1100px; margin: 0 auto;
      }
      .projects-section h2 {
        margin: 0 0 24px; font-size: clamp(22px,4vw,32px); font-weight: 700;
      }
      .projects-grid {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 16px;
      }
      .project-card {
        grid-column: span 12;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 16px;
        padding: 16px;
      }
      @media (min-width: 720px) {
        .project-card { grid-column: span 6; }
      }
      @media (min-width: 1024px) {
        .project-card { grid-column: span 4; }
      }
    `}</style>
        </div>
    );
}
