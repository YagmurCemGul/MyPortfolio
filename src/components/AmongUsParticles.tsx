"use client";

import { useEffect, useState } from "react";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

export default function AmongUsParticles() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine); // küçük bundle
        }).then(() => setReady(true));
    }, []);

    if (!ready) return null;

    // Aşağıdaki options, paylaştığın "Among Us" konfigürasyonunun
    // React/tsParticles v3'e uyarlanmış sürümüdür.
    const options: ISourceOptions = {
        background: { color: { value: "#000000" } },
        fullScreen: { enable: true, zIndex: 0 }, // tuval tüm ekran, z-index 0'da
        detectRetina: true,
        fpsLimit: 120,
        interactivity: {
            detectsOn: "window",
            events: {
                onClick: { enable: false, mode: [] },
                onHover: { enable: false, mode: [] },
                resize: { enable: true, delay: 0.5 as any },
            },
            modes: {
                trail: { delay: 1, pauseOnStop: false, quantity: 1 },
                repulse: { distance: 200, duration: 0.4, factor: 100, speed: 1, maxSpeed: 50, easing: "ease-out-quad" as any },
                bounce: { distance: 200 },
                connect: { distance: 80, links: { opacity: 0.5 }, radius: 60 },
                grab: { distance: 100, links: { opacity: 1 } },
                push: { default: true, groups: [], quantity: 4 },
                remove: { quantity: 2 },
                slow: { factor: 3, radius: 200 },
                light: {
                    area: {
                        gradient: { start: { value: "#ffffff" }, stop: { value: "#000000" } },
                        radius: 1000,
                    },
                    shadow: { color: { value: "#000000" }, length: 2000 },
                },
            },
        },
        particles: {
            number: {
                value: 200,               // arka plan noktacıkları (istersen 80-120 yapabilirsin)
                density: { enable: false, width: 1920, height: 1080 },
                limit: { mode: "delete", value: 0 } as any,
            },
            color: { value: "#fff" },
            move: {
                enable: true,
                direction: "right",       // sağa akış
                speed: 5,
                angle: { value: 10, offset: 0 },
                straight: false,
                outModes: { default: "out" },
            },
            opacity: { value: 1 },
            shape: { type: "circle" },
            size: { value: 3 },
            collisions: { enable: false, mode: "bounce" as any, overlap: { enable: true, retries: 0 } },
            zIndex: { value: 5, opacityRate: 0.5, sizeRate: 1, velocityRate: 1 } as any,
        },
        // Karakteri üreten EMITTER
        emitters: {
            autoPlay: true,
            startCount: 0,
            life: { wait: false },
            rate: { quantity: 1, delay: 7 }, // 7 sn'de 1 kez doğsun (istersen 3 yap)
            shape: { type: "square", options: {}, replace: { color: false, opacity: false } as any } as any,
            size: { mode: "percent", height: 0, width: 0 } as any,
            // Emitter'ın ürettiği parçacık görüntüsü (Among Us sprite):
            particles: {
                shape: {
                    type: "images",
                    options: {
                        images: {
                            src: "https://particles.js.org/images/cyan_amongus.png",
                            width: 500,
                            height: 634,
                        },
                    },
                } as any,
                size: { value: 40 },
                move: {
                    speed: 10,                 // karakter hızı
                    straight: true,            // düz sağa
                    outModes: { default: "none", right: "destroy" },
                },
                zIndex: { value: 0 } as any,
                rotate: {
                    value: { min: 0, max: 360 },
                    animation: { enable: true, speed: 10, sync: true },
                },
            },
            position: { x: -5, y: 55 },   // ekranın solundan doğsun (y=%)
        } as any,
        motion: { disable: false, reduce: { value: true, factor: 4 } },
    };

    return (
        <Particles id="among-us" options={options} /* fullScreen olduğundan class gerekmez */ />
    );
}
