
//src/components/VideoCardPortal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Movie } from "src/types/Movie";
import { usePortal } from "src/providers/PortalProvider";
import { useDetailModal } from "src/providers/DetailModalProvider";
import { formatMinuteToReadable } from "src/utils/common";
import NetflixIconButton from "./NetflixIconButton";
import MaxLineTypography from "./MaxLineTypography";
import AgeLimitChip from "./AgeLimitChip";
import QualityChip from "./QualityChip";
import GenreBreadcrumbs from "./GenreBreadcrumbs";
import { useGetConfigurationQuery } from "src/store/slices/configuration";
import { MEDIA_TYPE } from "src/types/Common";
import { useSound } from "src/providers/SoundProvider";
import { getSoundForTitle } from "src/utils/sounds";
import { loadCounters, saveCounters, CardCounters } from "src/utils/userCounters";
import { useGetGenresQuery } from "src/store/slices/genre";
// import { MAIN_PATH } from "src/constant"; // not used anymore

interface VideoCardModalProps {
    video: Movie;
    anchorElement: HTMLElement;
}

export default function VideoCardPortal({ video, anchorElement }: VideoCardModalProps) {
    const router = useRouter();
    const { data: configuration } = useGetConfigurationQuery(undefined);
    const { data: genres } = useGetGenresQuery(MEDIA_TYPE.Movie);
    const setPortal = usePortal();
    const rect = anchorElement.getBoundingClientRect();
    const { setDetailType } = useDetailModal();

    // Prefer override-like fields from "video" (projects data)
    const matchPercent = (video as any)?.matchPercent as number | string | undefined;
    const year = (video as any)?.year as number | string | undefined;
    const ageLimit = (video as any)?.ageLimit as number | string | undefined;
    const minutes = (video as any)?.minutes as number | undefined;
    const durationText = (video as any)?.durationText as string | undefined;
    const quality = ((video as any)?.quality as string | undefined) ?? "HD";
    const skills = ((video as any)?.skills as string[] | undefined) ?? [];

    const computedDuration = durationText ?? (typeof minutes === "number" ? formatMinuteToReadable(minutes) : undefined);

    const rawBackdrop = video.backdrop_path ?? "";
    const isAbsBackdrop = /^https?:\/\//i.test(rawBackdrop);
    const absBackdrop = isAbsBackdrop
        ? rawBackdrop
        : `${configuration?.images.base_url ?? ""}w780${rawBackdrop}`;

    // Play link: match modal's href behavior
    const playHref = (video as any)?.href as string | undefined;
    const isExternalPlay = !!playHref && /^(https?:)?\/\//i.test(playHref);

    const sound = useSound();
    const soundSrc = getSoundForTitle(video.title);

    const [counters, setCounters] = useState<CardCounters>({ liked: false, added: false, likedCount: 0, addedCount: 0 });
    useEffect(() => { setCounters(loadCounters(video.title || "")); }, [video.title]);
    const toggleLiked = () => {
        setCounters(prev => {
            const next = { ...prev, liked: !prev.liked, likedCount: prev.liked ? prev.likedCount - 1 : prev.likedCount + 1 };
            saveCounters(video.title || "", next);
            return next;
        });
    };
    const toggleAdded = () => {
        setCounters(prev => {
            const next = { ...prev, added: !prev.added, addedCount: prev.added ? prev.addedCount - 1 : prev.addedCount + 1 };
            saveCounters(video.title || "", next);
            return next;
        });
    };

    return (
        <Card
            onPointerEnter={() => {
                window.dispatchEvent(new Event("miniportal:enter"));
            }}
            onPointerLeave={() => {
                // imleç gerçekten portaldan çıkınca kapat
                window.dispatchEvent(new Event("miniportal:leave"));
                setPortal(null, null);
            }}
            onClick={() => {
                // büyümüş kartın herhangi bir yerine tıklayınca detay aç
                setPortal(null, null); // önce hover portalı kapat
                // Modalı override ile aç ki bilgiler eşleşsin
                setDetailType({
                    mediaType: MEDIA_TYPE.Movie,
                    override: {
                        title: video.title,
                        overview: video.overview,
                        backdrop_path: absBackdrop,
                        href: (video as any).href,
                        skills: skills,
                        availableIn: (video as any).availableIn,
                        matchPercent,
                        year,
                        ageLimit,
                        minutes,
                        durationText,
                        quality,
                    },
                });
            }}
            sx={{
                width: rect.width * 1.5,
                height: "100%",
                cursor: "pointer",        // 👈 görsel geri bildirim
                overflow: "hidden",
            }}
        >
            <div style={{ width: "100%", position: "relative", paddingTop: "calc(9 / 16 * 100%)" }}>
                <img
                    src={absBackdrop}
                    alt={video.title || "Video backdrop"}
                    loading="lazy"
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        backgroundPosition: "50%",
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        paddingLeft: "16px",
                        paddingRight: "16px",
                        paddingBottom: "4px",
                        position: "absolute",
                    }}
                >
                    <MaxLineTypography maxLine={2} sx={{ width: "80%", fontWeight: 700 }} variant="h6">
                        {video.title}
                    </MaxLineTypography>
                    <div style={{ flexGrow: 1 }} />
                    <NetflixIconButton onClick={(e) => { e.stopPropagation(); if (soundSrc) sound.toggle(soundSrc); }}>
                        {!sound.muted ? <VolumeUpIcon /> : <VolumeOffIcon />}
                    </NetflixIconButton>
                </div>
            </div>

            <CardContent>
                <Stack spacing={1}>
                    <Stack direction="row" spacing={1}>
                        <NetflixIconButton
                            sx={{ p: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!playHref || playHref === "#") return;
                                if (isExternalPlay) {
                                    window.open(playHref, "_blank", "noopener,noreferrer");
                                } else {
                                    router.push(playHref.startsWith("/") ? playHref : `/${playHref}`);
                                }
                            }}
                        >
                            <PlayCircleIcon sx={{ width: 40, height: 40 }} />
                        </NetflixIconButton>
                        <NetflixIconButton onClick={(e) => { e.stopPropagation(); toggleAdded(); }}>
                            {counters.added ? <CheckIcon /> : <AddIcon />}
                        </NetflixIconButton>
                        <NetflixIconButton onClick={(e) => { e.stopPropagation(); toggleLiked(); }}>
                            {counters.liked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
                        </NetflixIconButton>
                        <div style={{ flexGrow: 1 }} />
                        <NetflixIconButton
                            onClick={() =>
                                setDetailType({
                                    mediaType: MEDIA_TYPE.Movie,
                                    override: {
                                        title: video.title,
                                        overview: video.overview,
                                        backdrop_path: absBackdrop,
                                        href: (video as any).href,
                                        skills: skills,
                                        availableIn: (video as any).availableIn,
                                        matchPercent,
                                        year,
                                        ageLimit,
                                        minutes,
                                        durationText,
                                        quality,
                                    },
                                })
                            }
                        >
                            <ExpandMoreIcon />
                        </NetflixIconButton>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                        {typeof matchPercent !== "undefined" && String(matchPercent) !== "" && (
                            <Typography variant="subtitle1" sx={{ color: "success.main" }}>
                                {`${String(matchPercent)}% Match`.replace("%%", "%")}
                            </Typography>
                        )}
                        {typeof ageLimit !== "undefined" && String(ageLimit) !== "" && (
                            <AgeLimitChip label={typeof ageLimit === "number" ? `${ageLimit}+` : String(ageLimit)} />
                        )}
                        {computedDuration && (
                            <Typography variant="subtitle2">{computedDuration}</Typography>
                        )}
                        {quality && <QualityChip label={quality} />}
                    </Stack>

                    {skills.length > 0 ? (
                        <GenreBreadcrumbs genres={skills} />
                    ) : (
                        genres && (
                            <GenreBreadcrumbs
                                genres={genres
                                    .filter((g) => video.genre_ids.includes(g.id))
                                    .map((g) => g.name)}
                            />
                        )
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
