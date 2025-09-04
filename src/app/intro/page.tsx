"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./title.module.css";

export default function IntroPage() {
  const router = useRouter();
  const [clicked, setClicked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockTriedRef = useRef(false);

  const play = useCallback(() => {
    if (clicked) return;
    setClicked(true);
    try {
      const a = audioRef.current;
      if (a) {
        a.currentTime = 0;
        a.play().catch(() => {});
      }
    } catch {}
  }, [clicked]);

  // Auto-start intro on mount (animation + best-effort audio)
  useEffect(() => {
    // slight delay to ensure element is mounted
    const t = setTimeout(() => {
      if (!clicked) {
        setClicked(true);
        try {
          const a = audioRef.current;
          if (a) {
            a.currentTime = 0;
            a.play().catch(() => {});
          }
        } catch {}
      }
    }, 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autoplay policy: try to unlock on first user gesture
  useEffect(() => {
    const unlock = () => {
      if (unlockTriedRef.current) return cleanup();
      unlockTriedRef.current = true;
      const a = audioRef.current;
      if (!a) return cleanup();
      try {
        const pr = a.play();
        if (pr && typeof pr.then === 'function') {
          pr.then(() => {
            a.pause();
            a.currentTime = 0;
            cleanup();
          }).catch(() => cleanup());
        } else {
          cleanup();
        }
      } catch {
        cleanup();
      }
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

  useEffect(() => {
    if (!clicked) return;
    const t = setTimeout(() => {
      router.push("/accounts");
    }, 4000);
    return () => clearTimeout(t);
  }, [clicked, router]);

  return (
    <div className={styles.container} onClick={play} role="button" aria-label="Start">
      <audio ref={audioRef} src="/assets/netflix-sound.mp3" preload="auto" playsInline />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/netflix.svg"
        alt="Intro Logo"
        className={`${styles.logo} ${clicked ? styles.animate : ''}`}
      />
    </div>
  );
}
