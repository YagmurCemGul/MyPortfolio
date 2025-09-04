"use client";

import { useEffect, useMemo, useState } from "react";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import rawOptions from "@/particles/particles.json";

export default function TsParticlesFromJSON() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => setReady(true));
    }, []);

    const options: ISourceOptions = useMemo(() => {
        const o = (rawOptions as unknown) as ISourceOptions;

        // Hero içine gömülü kullanım
        o.fullScreen = { enable: false, zIndex: 0 };

        // Arka plan şeffaf (arkadaki GIF görünsün)
        o.background = { ...(o.background ?? {}), color: { value: "transparent" } };

        // Reduce Motion etkisini kapatma
        (o as any).motion = { disable: false, reduce: { value: false } };

        // Güvenli number yapılandırması (limit+density ekle)
        o.particles = o.particles ?? {};
        o.particles.number = {
            ...(o.particles.number ?? {}),
            value: 0, // sayımı gruplar yönetecek
            limit: { value: 0, mode: "delete" },
            density: { enable: false, width: 1920, height: 1080 },
        };

        // Gruplar: çoğu akış (left), azı random
        (o as any).particles.groups = {
            stream: {
                number: { value: 130 },
                move: {
                    enable: true,
                    direction: "left",
                    straight: true,
                    random: false,
                    speed: 5.0,
                    outModes: { default: "out", left: "out", right: "out" },
                },
            },
            wander: {
                number: { value: 20 },
                move: {
                    enable: true,
                    direction: "none",
                    straight: false,
                    random: true,
                    speed: { min: 8.0, max: 0.9 },
                    outModes: { default: "out" },
                },
                opacity: { value: 0.75 },
                size: { value: { min: 1.5, max: 3 } },
            },
        };

        return o;
    }, []);

    if (!ready) return null;

    return (
        <Particles
            id="tsparticles"
            options={options}
            className="absolute inset-0 z-10 pointer-events-auto"
        />
    );
}
