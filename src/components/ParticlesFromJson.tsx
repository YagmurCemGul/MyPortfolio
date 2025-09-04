"use client";
"use client";

import { useEffect, useState } from "react";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { loadEmittersPlugin } from "@tsparticles/plugin-emitters";
import { loadImageShape } from "@tsparticles/shape-image";

export default function ParticlesFromJson({
                                              url = "/particles/amongus.json",
                                              className = "",
                                          }: { url?: string; className?: string }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
            await loadEmittersPlugin(engine); // emitter desteği (Among Us için şart)
            await loadImageShape(engine);     // image shape (Among Us sprite)
        }).then(() => setReady(true));
    }, []);

    if (!ready) return null;
    return <Particles id="tsparticles" url={url} className={className} />;
}
