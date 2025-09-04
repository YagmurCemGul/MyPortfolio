
//src/components/DetailModal.tsx 
"use client";
import { forwardRef, useMemo, useState, useEffect } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

import MaxLineTypography from "./MaxLineTypography";
import PlayButton from "./PlayButton";
import NetflixIconButton from "./NetflixIconButton";
import AgeLimitChip from "./AgeLimitChip";
import QualityChip from "./QualityChip";
import { formatMinuteToReadable, getRandomNumber } from "src/utils/common";
import { useDetailModal } from "src/providers/DetailModalProvider";
import { usePortal } from "src/providers/PortalProvider";
import { PROJECT_SECTIONS } from "src/data/myProjects";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";



import { loadCounters, saveCounters, CardCounters } from "src/utils/userCounters";
import { useSound } from "src/providers/SoundProvider";
import { getSoundForTitle } from "src/utils/sounds";




const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function DetailModal() {
    const { detail, setDetailType } = useDetailModal();
    const setPortal = usePortal();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const displayTitle    = detail.override?.title ?? "";
    const displayOverview = detail.override?.overview ?? "";
    const displayBackdrop = detail.override?.backdrop_path ?? "";
    const displayMatch = detail.override?.matchPercent ?? "";
    const displayYear =
        detail.override?.year ??
        ""; // istersen release_date'den fallback ekleyebilirsin
    const displayAge =
        typeof detail.override?.ageLimit === "number"
            ? `${detail.override?.ageLimit}+`
            : (detail.override?.ageLimit ?? "");
    const displayDuration =
        detail.override?.durationText ??
        (typeof detail.override?.minutes === "number"
            ? formatMinuteToReadable(detail.override!.minutes)
            : "");
    const displayQuality = detail.override?.quality ?? "HD";



    const [expanded, setExpanded] = useState(false);
    const sound = useSound();
    const soundSrc = getSoundForTitle(detail.override?.title);
    useEffect(() => setExpanded(false), [displayTitle]);
    
    const rawHref = detail.override?.href;
    const playHref = typeof rawHref === "string" && rawHref.trim() !== "" ? rawHref : undefined;

    const [counters, setCounters] = useState<CardCounters>({
        liked: false,
        added: false,
        likedCount: 0,
        addedCount: 0,
    });

// Kart başlığı değiştiğinde localStorage’dan yükle
    useEffect(() => {
        if (!displayTitle) return;
        const c = loadCounters(displayTitle);
        setCounters(c);
    }, [displayTitle]);

    const toggleLiked = () => {
        setCounters(prev => {
            const next = {
                ...prev,
                liked: !prev.liked,
                likedCount: prev.liked ? prev.likedCount - 1 : prev.likedCount + 1,
            };
            saveCounters(displayTitle, next);
            return next;
        });
    };

    const toggleAdded = () => {
        setCounters(prev => {
            const next = {
                ...prev,
                added: !prev.added,
                addedCount: prev.added ? prev.addedCount - 1 : prev.addedCount + 1,
            };
            saveCounters(displayTitle, next);
            return next;
        });
    };




    // “More Like This” kaynağı
    const allCards = useMemo(() => {
        return PROJECT_SECTIONS.flatMap(sec =>
            sec.textOverrides.map(ov => ({
                section: sec.name,
                title: ov.title ?? "",
                overview: ov.overview ?? "",
                backdrop_path: ov.backdrop_path ?? "",
                href: ov.href ?? "",                    // 👈 EKLE
                skills: ov.skills ?? [],                 // 👈
                availableIn: ov.availableIn ?? "English" // 👈
            }))
        ).filter(x => !!x.title && !!x.backdrop_path);
    }, []);

    const currentSection = useMemo(() => {
        const hit = allCards.find(c => c.title === displayTitle);
        return hit?.section;
    }, [allCards, displayTitle]);

    const moreLikeSorted = useMemo(() => {
        const items = allCards.filter(c => c.title !== displayTitle);
        return items.sort((a,b) => {
            const sa = a.section === currentSection ? 0 : 1;
            const sb = b.section === currentSection ? 0 : 1;
            return sa - sb;
        });
    }, [allCards, currentSection, displayTitle]);

    // override'lardan oku
    const displaySkills =
        (detail.override?.skills && detail.override.skills.join(", ")) ||
        // istersen section fallback'ı koru:
        (currentSection ?? "General");

    const displayAvailable =
        Array.isArray(detail.override?.availableIn)
            ? detail.override!.availableIn.join(", ")
            : (detail.override?.availableIn ?? "English");

    useEffect(() => { setPortal(null, null); }, [setPortal]);

    // ---- Basit yerel kalıcılık (her başlık için) ----
    type Metric = { likes: number; adds: number; liked: boolean; added: boolean };
    const STORAGE_KEY = "detailMetrics";

    function loadMetric(title: string): Metric {
        if (!title) return { likes: 0, adds: 0, liked: false, added: false };
        try {
            const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
            return all[title] ?? { likes: 0, adds: 0, liked: false, added: false };
        } catch {
            return { likes: 0, adds: 0, liked: false, added: false };
        }
    }

    function saveMetric(title: string, m: Metric) {
        if (!title) return;
        try {
            const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
            all[title] = m;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        } catch {}
    }

// Bu modalda gösterilen aktif karta ait metrik state’i
    const [{ likes, adds, liked, added }, setMetric] = useState<Metric>({
        likes: 0,
        adds: 0,
        liked: false,
        added: false,
    });

// Başlık değişince ilgili kaydı yükle
    useEffect(() => {
        setMetric(loadMetric(displayTitle));
    }, [displayTitle]);

// Toggle handler’ları
    const toggleLike = () => {
        setMetric(prev => {
            const nextLiked = !prev.liked;
            const nextLikes = Math.max(0, prev.likes + (nextLiked ? 1 : -1));
            const next = { ...prev, liked: nextLiked, likes: nextLikes };
            saveMetric(displayTitle, next);
            return next;
        });
    };

    const toggleAdd = () => {
        setMetric(prev => {
            const nextAdded = !prev.added;
            const nextAdds = Math.max(0, prev.adds + (nextAdded ? 1 : -1));
            const next = { ...prev, added: nextAdded, adds: nextAdds };
            saveMetric(displayTitle, next);
            return next;
        });
    };


    // 👇 Modal override varsa da açılmalı
    const isOpen = !!detail.override;
    if (!isOpen) return null;

    return (
        <Dialog
            fullWidth
            fullScreen={fullScreen}   // 👈 mobilde tam ekran
            scroll="body"
            maxWidth="md"
            open={isOpen}
            TransitionComponent={Transition}
        >
            <DialogContent sx={{ p: 0, bgcolor: "#181818" }}>
                
                <Box sx={{ position: "relative", mb: 3 }}>
                    {/* ===== ÜST MEDYA (ratio box) ===== */}
                    <Box sx={{ width: "100%", position: "relative" }}>
                        {/* 16:9 oran için padding-top hilesi */}
                        <Box sx={{ position: "relative", pt: "56.25%" }}>
                            {/* — Görsel (GIF/IMG) — */}
                            {displayBackdrop && (
                                <img
                                    src={displayBackdrop}
                                    alt={displayTitle || "Backdrop"}
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            )}

                            {/* — Üstteki karartma/gradyanlar — */}
                            <Box
                                sx={{
                                    background: `linear-gradient(77deg,rgba(0,0,0,.6),transparent 85%)`,
                                    position: "absolute",
                                    inset: 0,
                                    right: "26.09%",
                                }}
                            />
                            <Box
                                sx={{
                                    backgroundImage:
                                        "linear-gradient(180deg,hsla(0,0%,8%,0) 0,hsla(0,0%,8%,.15) 15%,hsla(0,0%,8%,.35) 29%,hsla(0,0%,8%,.58) 44%,#141414 68%,#141414)",
                                    position: "absolute",
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    height: "14.7vw",
                                }}
                            />

                            {/* — Kapat butonu — */}
                            <IconButton
                                onClick={() => setDetailType({})}
                                sx={{
                                    position: "absolute",
                                    top: 15,
                                    right: 15,
                                    bgcolor: "#181818",
                                    width: { xs: 22, sm: 40 },
                                    height: { xs: 22, sm: 40 },
                                }}
                            >
                                <CloseIcon sx={{ color: "white", fontSize: { xs: 14, sm: 22 } }} />
                            </IconButton>
                            {soundSrc && (
                                <IconButton
                                    onClick={() => sound.toggle(soundSrc)}
                                    sx={{
                                        position: "absolute",
                                        top: 15,
                                        right: { xs: 44, sm: 64 },
                                        bgcolor: "#181818",
                                        width: { xs: 22, sm: 40 },
                                        height: { xs: 22, sm: 40 },
                                    }}
                                >
                                    {!sound.muted ? (
                                        <VolumeUpIcon sx={{ color: "white", fontSize: { xs: 14, sm: 22 } }} />
                                    ) : (
                                        <VolumeOffIcon sx={{ color: "white", fontSize: { xs: 14, sm: 22 } }} />
                                    )}
                                </IconButton>
                            )}

                            {/* — Başlık + aksiyonlar; ratio kutusunun ALT kenarına sabit — */}
                            <Box sx={{ position: "absolute", left: 0, right: 0, bottom: 16, px: { xs: 2, sm: 3, md: 5 } }}>
                                <MaxLineTypography variant="h4" maxLine={1} sx={{ mb: 2 }}>
                                    {displayTitle}
                                </MaxLineTypography>

                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3, minHeight: 44 }}>
                                    <PlayButton appearance="modal" label="Play" href={playHref} newTab />

                                    <NetflixIconButton
                                        onClick={toggleAdded}
                                        sx={{
                                            borderColor: counters.added ? "primary.main" : "grey.700",
                                            transform: counters.added ? "scale(1.05)" : "none",
                                            transition: "transform .12s",
                                        }}
                                    >
                                        {counters.added ? <CheckIcon /> : <AddIcon />}
                                    </NetflixIconButton>

                                    <NetflixIconButton
                                        onClick={toggleLiked}
                                        sx={{
                                            borderColor: counters.liked ? "primary.main" : "grey.700",
                                            transform: counters.liked ? "scale(1.05)" : "none",
                                            transition: "transform .12s",
                                        }}
                                    >
                                        {counters.liked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
                                    </NetflixIconButton>


                                    <Box flexGrow={1} />
                                </Stack>


                                <Container sx={{ p: "0 !important" }}>
                                    <Grid container spacing={{ xs: 2, sm: 5 }} alignItems="center">
                                    {/* SOL SÜTUN */}
                                        <Grid item xs={12} sm={6} md={8}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                {displayMatch !== "" && (
                                                    <Typography variant="subtitle1" sx={{ color: "success.main" }}>
                                                        {`${displayMatch}% Match`.replace("%%", "%")}
                                                    </Typography>
                                                )}
                                                {displayYear && <Typography variant="body2">{String(displayYear)}</Typography>}
                                                {displayAge && <AgeLimitChip label={String(displayAge)} />}
                                                {displayDuration && <Typography variant="subtitle2">{displayDuration}</Typography>}
                                                {displayQuality && <QualityChip label={displayQuality} />}
                                            </Stack>

                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    mt: 2,
                                                    display: "-webkit-box",
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                    WebkitLineClamp: expanded ? ("unset" as any) : 3,
                                                }}
                                            >
                                                {displayOverview}
                                            </Typography>

                                            {!expanded && displayOverview && displayOverview.length > 140 && (
                                                <Box
                                                    onClick={() => setExpanded(true)}
                                                    sx={{ mt: 1, cursor: "pointer", textDecoration: "underline", color: "grey.300" }}
                                                >
                                                    Read more
                                                </Box>
                                            )}
                                        </Grid>

                                        {/* SAĞ SÜTUN */}
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Typography variant="body2" sx={{ my: 1 }}>
                                                {`Skills : ${
                                                    Array.isArray(detail.override?.skills)
                                                        ? detail.override!.skills.join(", ")
                                                        : (currentSection ?? "General")
                                                }`}
                                            </Typography>
                                            <Typography variant="body2" sx={{ my: 1 }}>
                                                {`Available in : ${
                                                    Array.isArray(detail.override?.availableIn)
                                                        ? detail.override!.availableIn.join(", ")
                                                        : (detail.override?.availableIn ?? "English")
                                                }`}
                                            </Typography>
                                            <Typography variant="body2" sx={{ my: 1 }}>
                                                {`Liked : ${counters.likedCount.toLocaleString()}`}
                                            </Typography>
                                            <Typography variant="body2" sx={{ my: 1 }}>
                                                {`Added to List : ${counters.addedCount.toLocaleString()}`}
                                            </Typography>
                                            
                                        </Grid>
                                    </Grid>
                                </Container>

                                {/* ← içerik kutusunu kapatıyoruz */}
                            </Box>
                            {/* ← ratio kutusunu kapatıyoruz */}
                        </Box>
                        {/* ← üst alan sargısını kapatıyoruz */}
                    </Box>


                    {moreLikeSorted.length > 0 && (
                        <Container sx={{ py: 2, px: { xs: 2, sm: 3, md: 5 } }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>More Like This</Typography>
                            <Grid container spacing={2}>
                                {moreLikeSorted.map((it) => (
                                    <Grid item xs={6} sm={4} key={`${it.section}-${it.title}`}>
                                        <Box
                                            sx={{ borderRadius: 1, overflow: "hidden", cursor: "pointer", bgcolor: "#111" }}
                                            onClick={() =>
                                                setDetailType({
                                                    id: detail.id,
                                                    mediaType: detail.mediaType,
                                                    override: { 
                                                        title: it.title, 
                                                        overview: it.overview, 
                                                        backdrop_path: it.backdrop_path, 
                                                        href: it.href,
                                                        skills: it.skills,
                                                        availableIn: it.availableIn,
                                                    },
                                                })
                                            }
                                        >
                                            <Box sx={{ position: "relative", pt: "56.25%" }}>
                                                <img src={it.backdrop_path} alt={it.title} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
                                            </Box>
                                            <Box sx={{ p: 1.2 }}>
                                                <Typography variant="subtitle2" noWrap title={it.title}>{it.title}</Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.7 }}>{it.section}</Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Container>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
}
