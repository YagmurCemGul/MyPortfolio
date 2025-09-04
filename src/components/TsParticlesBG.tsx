"use client";

import { useCallback, useMemo } from "react";
import Particles from "@tsparticles/react";
import type { Engine, ISourceOptions } from "@tsparticles/engine";
import { loadFull } from "tsparticles";
import rawOptions from "@/particles/nyancat2.json"; // senin JSON

export default function TsParticlesBG() {
    const init = useCallback(async (engine: Engine) => {
        await loadFull(engine);
    }, []);

    // JSON’u hero içine uygun hale getir: fullScreen kapalı + transparan zemin
    const options = useMemo(() => {
        const o = (rawOptions as unknown) as ISourceOptions;
        o.fullScreen = { enable: false, zIndex: 10 };
        o.background = { color: { value: "transparent" } }; // ← ŞEFFAF
        return o;
    }, []);

    return (
        <Particles id="tsparticles" init={init} options={options} className="absolute inset-0 z-10" />
    );
}
