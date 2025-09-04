// src/components/slick-slider/SlickSlider.tsx
"use client";
import { useState, useRef, useMemo } from "react";
import Slider, { Settings } from "react-slick";
import { motion } from "framer-motion";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import CustomNavigation from "./CustomNavigation";
import VideoItemWithHover from "src/components/VideoItemWithHover";
import { ARROW_MAX_WIDTH } from "src/constant";
import MotionContainer from "src/components/animate/MotionContainer";
import { varFadeIn } from "src/components/animate/variants/fade/FadeIn";
import { CustomGenre, Genre } from "src/types/Genre";
import { Movie } from "src/types/Movie";
import { PaginatedMovieResult } from "src/types/Common";
import useMediaQuery from "@mui/material/useMediaQuery";

// ---- styled Slider: sadece kendi prop'unu tipliyoruz (padding)
const RootStyle = styled("div")(() => ({
        position: "relative", 
        overflow: "inherit", 
        zIndex: 2, 
    marginTop: 8,
}));

const StyledSlider = styled(Slider, {
    shouldForwardProp: (prop) => prop !== "padding" && prop !== "gap",
})<{ padding: number; gap: number }>(({ theme, padding, gap }) => ({
    display: "flex !important",
    justifyContent: "center",
    overflow: "initial !important",
    "& > .slick-list": {
        overflow: "visible",
        // kart içi paddingle genişlemeyi telafi et
        margin: `0 -${gap}px`,
    },
    // Her slide’ın iç sarmalayıcısına yatay padding ver
    "& .slick-slide > div": {
        padding: `0 ${gap}px`,
        boxSizing: "border-box",
    },
    [theme.breakpoints.up("sm")]: {
        "& > .slick-list": { width: `calc(100% - ${2 * padding}px)` },
        "& .slick-list > .slick-track": { margin: "0px !important" },
        "& .slick-list > .slick-track > .slick-current > div > .NetflixBox-root > .NetflixPaper-root:hover":
            { transformOrigin: "0% 50% !important" },
    },
    [theme.breakpoints.down("sm")]: {
        "& > .slick-list": { width: `calc(100% - ${padding}px)` },
    },
}));

interface SlickSliderProps {
    data: PaginatedMovieResult;
    genre: Genre | CustomGenre;
    handleNext: (page: number) => void;
}

export default function SlickSlider({ data, genre }: SlickSliderProps) {
    const sliderRef = useRef<Slider | null>(null);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [showExplore, setShowExplore] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const theme = useTheme();
    // responsive gap (px)
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    const isMd = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const gap = isXs ? 6 : isMd ? 8 : 12;

    const items = useMemo(
        () => (data?.results ?? []).filter((i) => !!i.backdrop_path),
        [data?.results]
    );

    // Ekran genişliğine göre efektif slidesToShow’u hesapla
    const computeSlidesToShow = () => {
        const w = typeof window !== "undefined" ? window.innerWidth : 1920;
        if (w < 600) return 2;
        if (w < 900) return 3;
        if (w < 1200) return 4;
        if (w < 1536) return 5;
        return 6;
    };

    const settings: Settings = {
        speed: 500,
        arrows: false,           // mobilde oklar kapalı
        swipeToSlide: true,
        touchThreshold: 12,
        
        infinite: false,
        lazyLoad: "ondemand",
        slidesToShow: 6,
        slidesToScroll: 6,
        beforeChange: (current, next) => {
            if (current > next) setIsEnd(false);
            setActiveSlideIndex(next);
        },
        afterChange: (current) => {
            const visible = computeSlidesToShow();
            // Son sayfadaysak sağ oku gizle
            setIsEnd(current >= Math.max(0, items.length - visible));
        },
        responsive: [
        { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2, dots: true } },
        { breakpoint: 900, settings: { slidesToShow: 3, slidesToScroll: 3 } },
            { breakpoint: 1536, settings: { slidesToShow: 5, slidesToScroll: 5 } },
            { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 4 } },
            { breakpoint: 900,  settings: { slidesToShow: 3, slidesToScroll: 3 } },
            { breakpoint: 600,  settings: { slidesToShow: 2, slidesToScroll: 2 } },
        ],
    };
    const title =
        (genre as any)?.name ??
        (genre as any)?.apiString ??
        "Projects";
    return (
        <RootStyle>
            {/* Başlık */}
            <MotionContainer>
                <Stack
                    onMouseEnter={() => setShowExplore(true)}
                    onMouseLeave={() => setShowExplore(false)}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ px: { xs: 1, sm: 2 }, mb: 1, position: "relative", zIndex: 1 }}
                >
                    <Typography
                        component="h2"
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            letterSpacing: 0.2,
                            // görünürlük garantisi:
                            color: "common.white",
                            textShadow: "0 0 12px rgba(0,0,0,0.35)",
                            mr: 2,
                        }}
                    >
                        {title}
                    </Typography>

                    <Box aria-hidden>
                        {"Explore All".split("").map((letter, idx) => (
                            <motion.span key={idx} variants={varFadeIn} style={{ display: "inline-block" }}>
                                {letter}
                            </motion.span>
                        ))}
                    </Box>
                </Stack>
            </MotionContainer>

            {/* ⬇️ ÖNEMLİ: Slider’ı CustomNavigation ile SAR */}
            <CustomNavigation
                isEnd={isEnd}
                arrowWidth={ARROW_MAX_WIDTH}
                activeSlideIndex={activeSlideIndex}
                onPrevious={() => sliderRef.current?.slickPrev()}
                onNext={() => sliderRef.current?.slickNext()}
            >
                <StyledSlider
                    ref={sliderRef}
                    {...settings}
                    padding={ARROW_MAX_WIDTH}
                    gap={gap}
                >
                    {items.map((item) => (
                        <div key={item.id}>
                            <VideoItemWithHover video={item as Movie} />
                        </div>
                    ))}
                </StyledSlider>
            </CustomNavigation>

            {/* Fallback: veri yoksa boş kalmasın */}
            {items.length === 0 && (
                <Box sx={{ px: 2, py: 3, opacity: 0.6, fontSize: 14 }}>
                    Loading…
                </Box>
            )}
        </RootStyle>
    );
}
