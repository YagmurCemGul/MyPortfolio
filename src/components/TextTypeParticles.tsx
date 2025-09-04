"use client";

import { useEffect, useRef, useState } from "react";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import type { Container, ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { loadEmittersPlugin } from "@tsparticles/plugin-emitters";
import { loadTextShape } from "@tsparticles/shape-text";

type Props = {
    startDelay: number;     // ms: yazının başlaması
    title: string;
    subtitle: string;
    onDone?: () => void;    // yazılar bitince haber ver
};

export default function TextTypeParticles({ startDelay, title, subtitle, onDone }: Props) {
    const [engineReady, setEngineReady] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const containerRef = useRef<Container | null>(null);

    // tsParticles özelliklerini yükle (1 kez)
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
            await loadEmittersPlugin(engine); // <-- emitter desteği
            await loadTextShape(engine);      // <-- "text" shape
        }).then(() => setEngineReady(true));
    }, []);

    // Sabit sahne: hareket yok; harfleri zamanla "emit" edeceğiz
    const options: ISourceOptions = {
        fullScreen: { enable: false }, // parent kaplayacak
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        detectRetina: true,
        particles: {
            number: { value: 0 },     // her şey programatik eklenecek
            move: { enable: false },  // harfler sabit dursun
            shape: { type: "text" },
            size: { value: 28 },
            color: { value: "#ffffff" },
        },
    };

    // Typewriter: harfleri tek tek ekleyen yardımcı
    useEffect(() => {
        if (!engineReady || !loaded || !containerRef.current) return;

        const c = containerRef.current;
        const canvas = c.canvas.size;
        const w = canvas.width;
        const h = canvas.height;

        const lineGap = 48; // iki satır arası px
        const titleSize = 34; // başlık font px
        const subSize = 20;   // alt başlık font px

        const tSpacing = 22;  // başlık harf aralığı
        const sSpacing = 13;  // alt başlık harf aralığı

        const xStart = (chars: number, spacing: number) => Math.round(w / 2 - (chars * spacing) / 2);

        // Vurgulu: Container tipinde addEmitter görünmüyor; plugin yüklenince runtime’da var.
        const addEmitter = (opts: any) => (containerRef.current as any)?.addEmitter?.(opts);

        const emitChar = (ch: string, x: number, y: number, fontSize: number) => {
            // boşlukları da “çizelim” ama görünür bir partikül gerekmez.
            const charToDraw = ch === " " ? " " : ch;
            addEmitter?.({
                autoPlay: true,
                life: { count: 1 },
                rate: { quantity: 1, delay: 0 },
                size: { mode: "px", width: 0, height: 0 },
                position: { x, y },
                particles: {
                    shape: { type: "text", options: { text: { value: charToDraw, style: "", weight: "400", fill: true } } },
                    size: { value: fontSize },
                    move: { enable: false },
                    color: { value: "#ffffff" },
                    zIndex: { value: 50 },
                },
            });
        };

        const timers: number[] = [];
        const kick = window.setTimeout(() => {
            // 1) Başlık
            const tx0 = xStart(title.length, tSpacing);
            const ty = Math.round(h / 2 - lineGap / 2);

            for (let i = 0; i < title.length; i++) {
                const ch = title[i];
                const x = tx0 + i * tSpacing;
                timers.push(window.setTimeout(() => emitChar(ch, x, ty, titleSize), 75 * i)); // 75ms/harf
            }

            // 2) Alt başlık — başlık bittikten sonra
            const afterTitle = 75 * title.length + 250;
            timers.push(
                window.setTimeout(() => {
                    const sx0 = xStart(subtitle.length, sSpacing);
                    const sy = Math.round(h / 2 + lineGap / 2);

                    for (let j = 0; j < subtitle.length; j++) {
                        const ch = subtitle[j];
                        const x = sx0 + j * sSpacing;
                        timers.push(window.setTimeout(() => emitChar(ch, x, sy, subSize), 42 * j)); // 42ms/harf
                    }

                    const afterSubtitle = 42 * subtitle.length + 200;
                    timers.push(window.setTimeout(() => { onDone?.(); }, afterSubtitle));
                }, afterTitle)
            );
        }, startDelay);

        return () => {
            timers.forEach(clearTimeout);
            window.clearTimeout(kick);
        };
    }, [engineReady, loaded, startDelay, title, subtitle, onDone]);

    if (!engineReady) return null;

    return (
        <div className="pointer-events-none absolute inset-0 z-20">
            <Particles
                id="text-typewriter"
                options={options}
                // ↙️ TIP UYUMU: Promise<void> dönen async fonksiyon
                particlesLoaded={async (c?: Container) => {
                    containerRef.current = c ?? null;
                    setLoaded(true);
                }}
            />
        </div>
    );
}
