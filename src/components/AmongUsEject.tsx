"use client";

import React, { useMemo } from "react";

/**
 * Basitleştirilmiş ve garanti çalışan sürüm:
 * - Arka plan: siyah
 * - Yıldızlar: left:-10vw -> 110vw arası linear animasyon (transform yok)
 * - Crewmate: soldan sağa döne döne geçer (sonsuz döngü)
 * - Metin: harf harf belirip kaybolur (sonsuz döngü)
 *
 * SADECE text prop'u değişebilir.
 */
export default function AmongUsEject({ text = "Yagmur Cem Gul" }: { text?: string }) {
    // 140 yıldız (fazla olsun ki mutlaka görünsün)
    const stars = useMemo(() => {
        return Array.from({ length: 140 }).map((_, i) => {
            const size = Math.floor(Math.random() * 7) + 3; // 3..9 px
            const dur = Math.floor(Math.random() * 30) + 15; // 15..45 s
            const delay = -Math.floor(Math.random() * 40);   // -40..0 s
            const top = Math.floor(Math.random() * 102) - 1; // -1..100 vh
            return (
                <span
                    key={i}
                    className="star"
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        top: `${top}vh`,
                        animationDuration: `${dur}s`,
                        animationDelay: `${delay}s`,
                    }}
                />
            );
        });
    }, []);

    const letters = useMemo(() => {
        const chars = text.split("");
        const baseDurationSec = 5;
        return chars.map((ch, idx) => {
            const isSpace = ch === " ";
            const delay = ((idx * baseDurationSec) / Math.max(chars.length, 1)) * 0.6;
            return (
                <span
                    key={idx}
                    className={isSpace ? "w" : undefined}
                    style={{ animationDelay: `${delay}s`, animationDuration: `${baseDurationSec}s` }}
                >
          {ch}
        </span>
            );
        });
    }, [text]);

    return (
        <div className="eject-root">
            {/* Yıldızlar */}
            <div className="sky" aria-hidden>{stars}</div>

            {/* Metin */}
            <h1 className="title">{letters}</h1>

            {/* Crewmate (CSS ile çizilen) */}
            <div className="boi" aria-hidden>
                <div className="rightleg" />
                <div className="leftleg back" />
                <div className="backpack" />
                <div className="belly" />
                <div className="eye" />
                <div className="leftleg front" />
            </div>

            {/* SVG filter (inset) */}
            <svg className="filters" xmlns="http://www.w3.org/2000/svg">
                <filter id="inset" x="-50%" y="-50%" width="200%" height="200%">
                    <feFlood floodColor="black" result="outside-color" />
                    <feMorphology in="SourceAlpha" operator="dilate" radius="3.5" />
                    <feComposite in="outside-color" operator="in" result="outside-stroke" />
                    <feFlood floodColor="#0c9fc4" result="inside-color" />
                    <feComposite in2="SourceAlpha" operator="in" result="inside-stroke" />
                    <feMerge>
                        <feMergeNode in="outside-stroke" />
                        <feMergeNode in="inside-stroke" />
                    </feMerge>
                </filter>
            </svg>

            {/* Lokal stiller */}
            <style jsx>{`
                .eject-root {
                    position: relative;
                    width: 100vw;
                    height: 100vh;
                    overflow: hidden;
                    background: #000; /* siyah */
                }

                /* --- YILDIZLAR --- */
                .sky {
                    position: absolute;
                    inset: 0;
                    z-index: 1;           /* yıldız katmanı */
                    pointer-events: none; /* etkileşim kapalı, tıklamayı engellemesin */
                }
                .star {
                    position: absolute;
                    left: -10vw; /* ekranın biraz dışından gelsin */
                    border-radius: 50%;
                    background: #fff;
                    box-shadow: 0 0 6px rgba(255,255,255,0.85);
                    animation-name: star-move-left-right;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                    will-change: left;
                }

                /* --- CREWMATE --- */
                .boi {
                    position: absolute;
                    left: 0%;
                    top: 50%;
                    transform-origin: 13vmin 25vmin;
                    transform: translate3d(-50vmin, -20vmin, 0px) rotate(0turn);
                    animation: eject 5s infinite linear;
                    z-index: 2; /* yıldızların üstü */
                    pointer-events: none;
                }

                .eye {
                    position: absolute;
                    left: 13vmin;
                    top: 9vmin;
                    border: 6px solid black;
                    width: 10vmin;
                    height: 11vmin;
                    border-radius: 26vmin;
                    transform: rotate(18deg) scale(1, 0.5);
                    border-top-width: 12px;
                    border-bottom-width: 12px;
                    background:
                            radial-gradient(ellipse at 31% 20%, #f9fff7 15%, #fff0 20%),
                            radial-gradient(ellipse at 50% 40%, #82c9e4 65%, #fff0 70%),
                            radial-gradient(ellipse at 60% 30%, #40646f 100%, #fff0 100%);
                    background-size: 140% 100%, 96% 80%, 100% 100%;
                    background-repeat: no-repeat;
                }

                .belly {
                    position: absolute;
                    width: 15vmin;
                    height: 25vmin;
                    background: #0c9fc4 radial-gradient(ellipse at 42% 33%, #14ebe1 50%, #fff0 52%);
                    border-radius: 10vmin;
                    top: 7vmin;
                    left: 6vmin;
                    transform: rotate(10deg);
                    background-size: 140% 114%;
                    border: 7px solid black;
                }

                .backpack {
                    position: absolute;
                    left: 1.2vmin;
                    top: 14vmin;
                    background: #14ebe1;
                    width: 7vmin;
                    height: 11vmin;
                    border-radius: 3vmin;
                    transform: rotate(7deg);
                    border: 7px solid black;
                }

                .leftleg, .rightleg {
                    position: absolute;
                    width: 11vmin;
                    height: 11vmin;
                    border-radius: 20vmin;
                    background:
                            radial-gradient(ellipse at 20% 70%, #0c9fc4 15%, #fff0 15%),
                            radial-gradient(ellipse at 0% 29%, #fff0 40%, #0c9fc4 40%);
                    background-repeat: no-repeat;
                    background-size: 150% 96%, 100% 100%;
                }

                .leftleg { left: 1vmin; top: 25vmin; }
                .leftleg.back {
                    clip-path: polygon(-10% 110%, 100% 110%, 110% 60%, 70% 20%, -5% 30%);
                }
                .leftleg.front { filter: url(#inset); }

                .rightleg { left: 4vmin; top: 28vmin; filter: url(#inset); }

                /* --- METİN --- */
                .title {
                    position: absolute;
                    left: 0;
                    top: 50%;
                    width: 100%;
                    transform: translateY(-50%);
                    color: #fff;
                    font-family: Arial, Helvetica, sans-serif;
                    font-weight: 400;
                    text-align: center;
                    font-size: 20px;
                    z-index: 3; /* en üst katman */
                    pointer-events: none;
                }
                @media (min-width: 600px) {
                    .title { font-size: 30px; }
                }
                .title span {
                    display: inline-block;
                    opacity: 0;
                    animation-name: type;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }
                .title span.w { display: inline; }

                /* --- KEYFRAMES (local scope) --- */
                @keyframes eject {
                    0%   { transform: translate3d(-50vmin, -20vmin, 0px) rotate(0turn); }
                    50%,
                    100% { transform: translate3d(100vw, -20vmin, 0px) rotate(-2turn); }
                }

                @keyframes type {
                    0%   { width: 0; opacity: 0; }
                    20.5%{ width: auto; opacity: 1; }
                    90%  { opacity: 1; }
                    95%,100%{ opacity: 0; }
                }

                .filters {
                    position: absolute;
                    width: 0;
                    height: 0;
                    pointer-events: none;
                }
            `}</style>

            {/* Global keyframes: yıldız animasyonu (left üzerinden, garanti görünür) */}
            <style jsx global>{`
                @keyframes star-move-left-right {
                    from { left: -10vw; }
                    to   { left: 110vw; }
                }
            `}</style>
        </div>
    );
}
