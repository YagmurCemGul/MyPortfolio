
//src/components/VideoItemWithHover.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { Movie } from "src/types/Movie";
import { usePortal } from "src/providers/PortalProvider";
import { useGetConfigurationQuery } from "src/store/slices/configuration";
import { useDetailModal } from "src/providers/DetailModalProvider";   // 👈
import { MEDIA_TYPE } from "src/types/Common";                        // 👈
import VideoItemWithHoverPure from "./VideoItemWithHoverPure";

interface VideoItemWithHoverProps {
    video: Movie;
}

const CLOSE_DELAY = 180;
const ENTER_LOCK_MS = 220;

export default function VideoItemWithHover({ video }: VideoItemWithHoverProps) {
    const setPortal = usePortal();
    const elementRef = useRef<HTMLDivElement>(null);

    const [isHovered, setIsHovered] = useState(false);

    const closeTimerRef = useRef<number | null>(null);
    const leaveTimerRef = useRef<number | null>(null);
    const fromPortalRef = useRef(false);
    const enterLockRef = useRef<number>(0);

    const { data: configuration } = useGetConfigurationQuery(undefined);
    const { setDetailType } = useDetailModal();
    const isTouch = typeof window !== "undefined" && matchMedia("(hover: none)").matches;

    useEffect(() => {
        const onPortalEnter = () => {
            if (closeTimerRef.current) {
                window.clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
            }
            fromPortalRef.current = true;
            enterLockRef.current = Date.now() + ENTER_LOCK_MS;
        };
        const onPortalLeave = () => {
            fromPortalRef.current = false;
        };

        window.addEventListener("miniportal:enter", onPortalEnter as unknown as EventListener);
        window.addEventListener("miniportal:leave", onPortalLeave as unknown as EventListener);
        return () => {
            window.removeEventListener("miniportal:enter", onPortalEnter as unknown as EventListener);
            window.removeEventListener("miniportal:leave", onPortalLeave as unknown as EventListener);
        };
    }, []);

    useEffect(() => {
        if (isTouch) return; // 👈 mobilde hover yok
        if (isHovered && elementRef.current) {
            if (closeTimerRef.current) { window.clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
            setPortal(elementRef.current, video);
        } else {
            closeTimerRef.current = window.setTimeout(() => {
                setPortal(null, null);
                closeTimerRef.current = null;
            }, CLOSE_DELAY);
        }
        return () => {
            if (closeTimerRef.current) { window.clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
        };
    }, [isHovered, setPortal, video, isTouch]);


    const handleHoverChange = (v: boolean) => {
        if (isTouch) return;   // 👈 mobilde tetikleme
        if (v) {
            if (leaveTimerRef.current) {
                window.clearTimeout(leaveTimerRef.current);
                leaveTimerRef.current = null;
            }
            fromPortalRef.current = false;
            enterLockRef.current = Date.now() + ENTER_LOCK_MS;
            setIsHovered(true);
        } else {
            if (!leaveTimerRef.current) {
                leaveTimerRef.current = window.setTimeout(() => {
                    if (!fromPortalRef.current && Date.now() > enterLockRef.current) {
                        setIsHovered(false);
                    }
                    leaveTimerRef.current = null;
                }, 160);
            }
        }
    };

    // 👇 TIKLAMA: titremeyi önlemek için hover/portal’ı kapat ve detay aç
    const handleClick = () => {
        if (leaveTimerRef.current) { window.clearTimeout(leaveTimerRef.current); leaveTimerRef.current = null; }
        if (closeTimerRef.current) { window.clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
        setIsHovered(false);
        setPortal(null, null);
        // Detay modal

        const absSrc =
            /^https?:\/\//.test(video.backdrop_path ?? "")
                ? (video.backdrop_path as string)
                : `${configuration?.images.base_url ?? ""}w780${video.backdrop_path}`;

        setDetailType({
            override: {
                title: video.title,
                overview: video.overview,
                backdrop_path: absSrc,
                href: (video as any).href,
                skills: (video as any).skills,
                availableIn: (video as any).availableIn,

                // 👇 yeni alanlar
                matchPercent: (video as any).matchPercent,
                year: (video as any).year,
                ageLimit: (video as any).ageLimit,
                minutes: (video as any).minutes,
                durationText: (video as any).durationText,
                quality: (video as any).quality,
            },
        });

    };

    return (
        <VideoItemWithHoverPure
            ref={elementRef}
            onClick={handleClick}
            handleHover={handleHoverChange}
            src={
                /^https?:\/\//.test(video.backdrop_path ?? "")
                    ? (video.backdrop_path as string)
                    : `${configuration?.images.base_url ?? ""}w300${video.backdrop_path}`
            }
        />
    );
}
