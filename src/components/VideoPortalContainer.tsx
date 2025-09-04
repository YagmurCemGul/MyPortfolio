
//src/components/VideoPortalContainer.tsx
"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Portal from "@mui/material/Portal";

import VideoCardPortal from "./VideoCardPortal";
import MotionContainer from "./animate/MotionContainer";
import {
    varZoomIn,
    varZoomInLeft,
    varZoomInRight,
} from "./animate/variants/zoom/ZoomIn";
import { usePortalData } from "src/providers/PortalProvider";

export default function VideoPortalContainer() {
    const { miniModalMediaData, anchorElement } = usePortalData();
    const container = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef<number | null>(null);

    const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({
        top: 0,
        left: 0,
        width: 0,
    });

    const hasToRender = !!miniModalMediaData && !!anchorElement;

    const computeAndSet = useCallback(() => {
        if (!anchorElement) return;

        // aktif slide kenarlarını tespit et
        let isFirstElement = false;
        let isLastElement = false;

        const parentEl = anchorElement.closest(".slick-active") as HTMLElement | null;
        const nextSib = parentEl?.nextElementSibling as HTMLElement | null;
        const prevSib = parentEl?.previousElementSibling as HTMLElement | null;

        if (!prevSib?.classList.contains("slick-active")) {
            isFirstElement = true;
        } else if (!nextSib?.classList.contains("slick-active")) {
            isLastElement = true;
        }

        const rect = anchorElement.getBoundingClientRect();
        const vw = document.documentElement.clientWidth;
        const cardWidth = rect.width * 1.5;

        // yatay konum (clamp'li)
        let left = isFirstElement ? rect.left : rect.left - 0.25 * rect.width;
        if (isLastElement) left = rect.right - cardWidth;
        left = Math.max(8, Math.min(left, vw - cardWidth - 8));

        // dikey konum (fixed kullandığımız için pageYOffset eklemiyoruz)
        const top = Math.max(8, rect.top - 0.6 * rect.height);

        setCoords({ top, left, width: cardWidth });
    }, [anchorElement]);

    // ilk render + scroll/resize’larda yeniden konumlandır
    useEffect(() => {
        if (!hasToRender) return;

        computeAndSet();

        const onMove = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(computeAndSet);
        };

        window.addEventListener("scroll", onMove, { passive: true });
        window.addEventListener("resize", onMove);

        return () => {
            window.removeEventListener("scroll", onMove);
            window.removeEventListener("resize", onMove);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        };
    }, [hasToRender, computeAndSet]);

    // Recompute position whenever anchor changes while open
    useEffect(() => {
        if (!hasToRender) return;
        computeAndSet();
    }, [anchorElement, hasToRender, computeAndSet]);

    // animasyon yönü
    let variant = varZoomIn;
    if (hasToRender && anchorElement) {
        const parentEl = anchorElement.closest(".slick-active") as HTMLElement | null;
        const nextSib = parentEl?.nextElementSibling as HTMLElement | null;
        const prevSib = parentEl?.previousElementSibling as HTMLElement | null;

        if (!prevSib?.classList.contains("slick-active")) {
            variant = varZoomInLeft;
        } else if (!nextSib?.classList.contains("slick-active")) {
            variant = varZoomInRight;
        }
    }

    return (
        <>
            <MotionContainer open={hasToRender} initial="initial">
                <motion.div
                    ref={container}
                    key={miniModalMediaData ? String((miniModalMediaData as any).id ?? (miniModalMediaData as any).title ?? Math.random()) : 'empty'}
                    variants={variant}
                    style={{
                        zIndex: 1600,                           // daha üste
                        position: "fixed",
                        display: hasToRender ? "inline-block" : "none",
                        pointerEvents: hasToRender ? "auto" : "none", // 👈 tıklamayı bu katmanda aç
                        ...(hasToRender && {
                            top: coords.top,
                            left: coords.left,
                            width: coords.width,
                        }),
                    }}
                />
            </MotionContainer>

            {hasToRender && (
                <Portal container={container.current}>
                    <VideoCardPortal
                        key={miniModalMediaData ? String((miniModalMediaData as any).id ?? (miniModalMediaData as any).title ?? 'k') : 'k-empty'}
                        video={miniModalMediaData}
                        anchorElement={anchorElement}
                    />
                </Portal>
            )}
        </>
    );
}
