"use client";

import { useEffect, useMemo, useState } from "react";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

type Mode = "flow" | "parallax";

/**
 * mode="flow"    → başlangıç & yazı esnası: yıldızlar soldan sağa akar
 * mode="parallax"→ yazı tamamlanınca: akış durur, mouse ile 3D/parallax
 */
export default function Starfield({
                                      mode = "flow",
                                      speed = 0.65,
                                  }: { mode?: Mode; speed?: number }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => setReady(true));
    }, []);

    const options = useMemo<ISourceOptions>(() => {
        const common: ISourceOptions = {
            fullScreen: { enable: true, zIndex: 0 },
            background: { color: { value: "#000000" } },
            fpsLimit: 120,
            detectRetina: true,
            particles: {
                number: { value: 140, density: { enable: false, width: 1920, height: 1080 } },
                color: { value: "#ffffff" },
                size: { value: { min: 1, max: 3 } },
                opacity: { value: 0.8 },
                shape: { type: "circle" },
                links: { enable: false },
            },
            interactivity: { detectsOn: "window", events: {} as any, modes: {} },
            motion: { disable: false, reduce: { value: false, factor: 0 } },
        };

        if (mode === "flow") {
            return {
                ...common,
                particles: {
                    ...common.particles!,
                    move: {
                        enable: true,
                        direction: "right",
                        speed,
                        random: true,
                        straight: false,
                        outModes: { default: "out" },
                    },
                },
                interactivity: {
                    detectsOn: "window",
                    events: { onHover: { enable: false, mode: [] } },
                    modes: {},
                },
            };
        }

        return {
            ...common,
            particles: {
                ...common.particles!,
                move: { enable: false, direction: "right", speed: 0, outModes: { default: "out" } },
            },
            interactivity: {
                detectsOn: "window",
                events: {
                    onHover: { enable: true, mode: [], parallax: { enable: true, force: 40, smooth: 16 } },
                },
                modes: {},
            },
        };
    }, [mode, speed]);

    if (!ready) return null;
    return <Particles id="starfield" options={options} />;
}
