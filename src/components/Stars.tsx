"use client";

import { useEffect, useState } from "react";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function Stars() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => setReady(true));
    }, []);

    if (!ready) return null;

    // Ortak taban ayarlar
    const base = {
        fullScreen: { enable: false },
        background: { color: { value: "transparent" } },
        detectRetina: true,
        fpsLimit: 90,
    } as const;

    return (
        // YALNIZCA TEK CANVAS: sağdan sola düz akış
        <Particles
            id="tsp-stream"
            className="absolute inset-0 z-10 pointer-events-auto"
            options={{
                ...base,
                interactivity: {
                    events: { onClick: { enable: true, mode: "repulse" } },
                    modes: { repulse: { distance: 180, duration: 0.4 } },
                },
                particles: {
                    // HATAYI ÖNLEMEK İÇİN limit + density VERİLİ
                    number: {
                        value: 130,
                        limit: { value: 0, mode: "delete" },
                        density: { enable: false, width: 1920, height: 1080 },
                    },
                    shape: { type: "star", options: { star: { sides: 5 } } },
                    color: { value: "#ffffff" },
                    opacity: { value: 0.85 },
                    size: { value: { min: 2, max: 4 } },
                    links: { enable: false },
                    move: {
                        enable: true,
                        direction: "left",        // sağdan sola
                        straight: true,           // düz akış
                        speed: 5.0,               // hız (1.6–2.4 arası deneyebilirsin)
                        outModes: { default: "out", left: "out", right: "out" },
                    },
                },
            }}
        />
    );
}
