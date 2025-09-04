"use client";

import { useEffect, useMemo, useState } from "react";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { loadEmittersPlugin } from "@tsparticles/plugin-emitters";
import { loadImageShape } from "@tsparticles/shape-image";
import type { ISourceOptions } from "@tsparticles/engine";

/** —— Kolay ince ayar için sabitler —— */
const STAR_SPEED = 0.22;           // yıldız akış hızı (çok yavaş)
const AMONG_SPEED = 1.8;           // among us yatay hız (yavaş)
const START_DELAY_MS = 2200;       // yazı başlangıcı (karakter merkeze yaklaştığında)
const TITLE_INTERVAL_MS = 95;      // başlık yazı hızı (yavaş)
const SUBTITLE_INTERVAL_MS = 55;   // alt başlık yazı hızı (yavaş)
const AMONG_Y = 50;                // karakter geçiş yüksekliği (yüzde, 0=üst 100=alt)
const AMONG_SIZE = 46;             // karakter boyutu (px yaklaşık)

type Props = {
    title: string;
    subtitle: string;
};

export default function AmongUsScene({ title: fullTitle, subtitle: fullSubtitle }: Props) {
    const [ready, setReady] = useState(false);
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [interactive, setInteractive] = useState(false);

    /** Engine + gerekli pluginler */
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
            await loadEmittersPlugin(engine); // emitter desteği
            await loadImageShape(engine);     // image shape (among us sprite)
        }).then(() => setReady(true));
    }, []);

    /** Typewriter — karakter merkezden geçmeye yaklaşınca başlasın (gecikmeyle) */
    useEffect(() => {
        if (!ready) return;
        let startTimer: any, t1: any, t2: any;

        startTimer = setTimeout(() => {
            // Başlık yazımı
            let i = 0;
            t1 = setInterval(() => {
                setTitle(fullTitle.slice(0, i + 1));
                i++;
                if (i >= fullTitle.length) {
                    clearInterval(t1);

                    // Alt başlık yazımı
                    let j = 0;
                    t2 = setInterval(() => {
                        setSubtitle(fullSubtitle.slice(0, j + 1));
                        j++;
                        if (j >= fullSubtitle.length) {
                            clearInterval(t2);
                            // Yazı tamamlandı → hover "attract" aç
                            setInteractive(true);
                        }
                    }, SUBTITLE_INTERVAL_MS);
                }
            }, TITLE_INTERVAL_MS);
        }, START_DELAY_MS);

        return () => {
            clearTimeout(startTimer);
            clearInterval(t1);
            clearInterval(t2);
        };
    }, [ready, fullTitle, fullSubtitle]);

    /** Yıldızlar — çok yavaş sağa akış, yazı bitince hover=attract */
    const starOptions = useMemo<ISourceOptions>(() => ({
        fullScreen: { enable: true, zIndex: 0 },
        background: { color: { value: "#000000" } },
        detectRetina: true,
        fpsLimit: 120,
        interactivity: {
            detectsOn: "window",
            events: {
                onHover: { enable: interactive, mode: ["attract"] }, // yumuşak içinde gezinme
                resize: { enable: true, delay: 0.3 as any },
            },
            modes: {
                attract: {
                    distance: 140,
                    duration: 0.25,
                    factor: 1,
                    speed: 0.6,
                    maxSpeed: 2,
                    easing: "ease-out-quad" as any,
                },
            },
        },
        particles: {
            number: { value: 110, density: { enable: false, width: 1920, height: 1080 } },
            color: { value: "#ffffff" },
            size: { value: { min: 1, max: 3 } },
            opacity: { value: 0.7 },
            move: {
                enable: true,
                direction: "right",
                speed: STAR_SPEED,   // ← çok yavaş
                random: true,
                straight: false,
                outModes: { default: "out" },
            },
            shape: { type: "circle" },
            links: { enable: false },
        },
        motion: { disable: false, reduce: { value: false, factor: 0 } },
    }), [interactive]);

    /** Among Us — tek geçiş, yavaş, ekran ortası civarı */
    const amongOptions = useMemo<ISourceOptions>(() => ({
        fullScreen: { enable: true, zIndex: 1 },
        background: { color: { value: "transparent" } },
        detectRetina: true,
        particles: { number: { value: 0 } }, // sadece emitter
        emitters: {
            autoPlay: true,
            life: { wait: false, count: 1 },   // tek sefer
            startCount: 1,                     // sayfa yüklenince başlasın
            rate: { quantity: 0, delay: 9999 },// bir daha üretme
            position: { x: -8, y: AMONG_Y },   // hafif sol dış + ortadan
            particles: {
                shape: {
                    type: "image",
                    options: {
                        image: {
                            src: "https://particles.js.org/images/cyan_amongus.png",
                            width: 500,
                            height: 634,
                        },
                    },
                } as any,
                size: { value: AMONG_SIZE },
                move: {
                    enable: true,
                    direction: "right",
                    straight: true,
                    speed: AMONG_SPEED,            // ← yavaş
                    outModes: { default: "none", right: "destroy" },
                    // "uzayda sürüklenme" hissi için çok hafif rastgelelik:
                    angle: { value: 0, offset: 0 },
                    random: false,
                },
                rotate: {
                    value: { min: -1, max: 1 },    // çok hafif açı (neredeyse düz)
                    animation: { enable: false, speed: 0, sync: true },
                },
                zIndex: { value: 2 } as any,
            },
        } as any,
        motion: { disable: false, reduce: { value: false, factor: 0 } },
    }), []);

    if (!ready) return null;

    return (
        <>
            {/* Arka plan yıldızları */}
            <Particles id="stars-right" options={starOptions} />

            {/* Among Us karakteri: tek ve yavaş geçiş */}
            <Particles id="among-us-once" options={amongOptions} />

            {/* Metin katmanı */}
            <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center px-6 text-center">
                <div className="max-w-4xl">
                    <h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-tight">
                        {title}
                        <span className="animate-pulse">▌</span>
                    </h1>
                    <p className="mt-4 text-white/85 text-lg md:text-2xl">
                        {subtitle}
                    </p>
                </div>
            </div>
        </>
    );
}
