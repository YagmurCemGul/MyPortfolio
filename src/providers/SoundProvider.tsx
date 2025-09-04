"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type SoundCtx = {
  muted: boolean;
  currentSrc: string | null;
  toggle: (src: string) => void;
  stop: () => void;
};

const Ctx = createContext<SoundCtx | null>(null);

export function useSound() {
  const v = useContext(Ctx);
  if (!v) throw new Error("SoundProvider missing in tree");
  return v;
}

export default function SoundProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);

  const ensureAudio = () => {
    if (!audioRef.current) {
      const a = new Audio();
      a.preload = "auto";
      a.crossOrigin = "anonymous";
      a.playsInline = true as any;
      audioRef.current = a;
    }
    return audioRef.current!;
  };

  const stop = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      try { a.pause(); } catch {}
      try { a.currentTime = 0; } catch {}
    }
  }, []);

  const toggle = useCallback((src: string) => {
    const a = ensureAudio();
    // If muted or switching track → unmute and play requested
    if (muted || currentSrc !== src) {
      try {
        setMuted(false);
        if (currentSrc !== src) {
          setCurrentSrc(src);
          a.src = src;
        }
        a.currentTime = 0;
        a.play().catch(() => {});
      } catch {}
      return;
    }
    // Same track and currently unmuted → mute/stop
    setMuted(true);
    stop();
  }, [muted, currentSrc, stop]);

  const value = useMemo<SoundCtx>(() => ({ muted, currentSrc, toggle, stop }), [muted, currentSrc, toggle, stop]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

