
//src/components/HeroSection.tsx
"use client";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import Player from "video.js/dist/types/player";

import { getRandomNumber } from "src/utils/common";
import MaxLineTypography from "./MaxLineTypography";
import PlayButton from "./PlayButton";
import MoreInfoButton from "./MoreInfoButton";
import NetflixIconButton from "./NetflixIconButton";
import MaturityRate from "./MaturityRate";
import useOffSetTop from "src/hooks/useOffSetTop";
import { useDetailModal } from "src/providers/DetailModalProvider";
import { MEDIA_TYPE } from "src/types/Common";
import {
  useGetVideosByMediaTypeAndCustomGenreQuery,
  useLazyGetAppendedVideosQuery,
} from "src/store/slices/discover";
import { Movie } from "src/types/Movie";
import VideoJSPlayer from "./watch/VideoJSPlayer";
import { useSound } from "src/providers/SoundProvider";
import { PROJECTS_HERO_SOUND } from "src/utils/sounds";

interface TopTrailerProps {
  mediaType: MEDIA_TYPE;
  heroImageUrl?: string; // 👈 yeni
    heroTitle?: string;    // 👈 yeni
    heroText?: string;     // 👈 yeni
}

export default function TopTrailer({ mediaType, heroImageUrl, heroTitle, heroText }: TopTrailerProps) {
  const pathname = usePathname();
  const onProjects = pathname?.startsWith('/projects');
  const { data } = useGetVideosByMediaTypeAndCustomGenreQuery({
    mediaType,
    apiString: "popular",
    page: 1,
  });
  const [getVideoDetail, { data: detail }] = useLazyGetAppendedVideosQuery();
  const [video, setVideo] = useState<Movie | null>(null);
  const [muted, setMuted] = useState(true);
  const playerRef = useRef<Player | null>(null);
    const [threshold, setThreshold] = useState(0);
    const isOffset = useOffSetTop(threshold);
    const { setDetailType } = useDetailModal();
  // Use a constant to avoid SSR/CSR hydration mismatches
  const maturityRate = 18;
    // Başlık & metin (props > video > fallback)
    const computedTitle =
        heroTitle ?? video?.title ?? "Impact Works";
    const computedText =
        heroText ?? video?.overview ?? "Blending game dev, digital strategy, and project leadership to create innovative solutions with proven impact.";

  const handleReady = useCallback((player: Player) => {
    playerRef.current = player;
  }, []);

  useEffect(() => {
      setThreshold(window.innerWidth * 0.5625);
    if (playerRef.current) {
      if (isOffset) {
        playerRef.current.pause();
      } else {
        if (playerRef.current.paused()) {
          playerRef.current.play();
        }
      }
    }
  }, [isOffset]);

  useEffect(() => {
    if (data && data.results) {
      const videos = data.results.filter((item) => !!item.backdrop_path);
      setVideo(videos[getRandomNumber(videos.length)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (video) {
      getVideoDetail({ mediaType, id: video.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video]);

  const handleMute = useCallback((status: boolean) => {
    if (playerRef.current) {
      playerRef.current.muted(!status);
      setMuted(!status);
    }
  }, []);
  const sound = useSound();
  const toggleHeroSound = useCallback(() => {
    sound.toggle(PROJECTS_HERO_SOUND);
  }, [sound]);

    return (
        // Hero altta dursun; slider üstte render edilsin
        <Box sx={{ position: "relative", zIndex: 0 }}>
      <Box
        sx={{
          mb: 3,
          pb: "40%",
          top: 0,
          left: 0,
          right: 0,
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "56.25vw",
            position: "absolute",
          }}
        >
            {(heroImageUrl || video) && (
            <>
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  position: "absolute",
                }}
              >
                  {heroImageUrl ? (
                      <img
                          src={heroImageUrl}
                          alt="Hero"
                          style={{
                              position: "absolute",
                              inset: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                          }}
                      />
                  ) : (
                      detail && (
                          <VideoJSPlayer
                              options={{
                                  loop: true,
                                  muted: true,
                                  autoplay: true,
                                  controls: false,
                                  responsive: true,
                                  fluid: true,
                                  techOrder: ["youtube"],
                                  sources: [
                                      {
                                          type: "video/youtube",
                                          src: `https://www.youtube.com/watch?v=${
                                              detail.videos.results[0]?.key || "L3oOldViIgY"
                                          }`,
                                      },
                                  ],
                              }}
                              onReady={handleReady}
                          />
                      )
                  )}
                  <Box
                  sx={{
                    background: `linear-gradient(77deg,rgba(0,0,0,.6),transparent 85%)`,
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: "26.09%",
                    opacity: 1,
                    position: "absolute",
                    transition: "opacity .5s",
                      pointerEvents: "none",
                      zIndex: 0,
                  }}
                />
                <Box
                  sx={{
                    backgroundColor: "transparent",
                    backgroundImage:
                      "linear-gradient(180deg,hsla(0,0%,8%,0) 0,hsla(0,0%,8%,.15) 15%,hsla(0,0%,8%,.35) 29%,hsla(0,0%,8%,.58) 44%,#141414 68%,#141414)",
                    backgroundRepeat: "repeat-x",
                    backgroundPosition: "0px top",
                    backgroundSize: "100% 100%",
                    bottom: 0,
                    position: "absolute",
                    height: "14.7vw",
                    opacity: 1,
                    top: "auto",
                    width: "100%",
                      pointerEvents: "none",
                      zIndex: 0,
                  }}
                />
                  {(!heroImageUrl) ? (
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    alignItems: "center",
                    position: "absolute",
                    right: 0,
                    bottom: "35%",
                  }}
                >
                  <NetflixIconButton
                    size="large"
                    onClick={() => handleMute(muted)}
                    sx={{ zIndex: 2 }}
                  >
                    {!muted ? <VolumeUpIcon /> : <VolumeOffIcon />}
                  </NetflixIconButton>
                  <MaturityRate
                    sx={onProjects ? {
                      fontSize: { xs: 14, sm: 22 },
                      py: { xs: 0.5, sm: 1 },
                      pl: { xs: 1, sm: 1.5 },
                      pr: { xs: 1.5, sm: 3 },
                    } : undefined}
                  >
                    {`${maturityRate}+`}
                  </MaturityRate>
                </Stack>
                  ) : (
                    // heroImageUrl olduğunda VideoJS yok; ses butonunu SoundProvider ile göster
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        alignItems: "center",
                        position: "absolute",
                        right: 0,
                        bottom: "35%",
                      }}
                    >
                      <NetflixIconButton size="large" onClick={toggleHeroSound} sx={{ zIndex: 2 }}>
                        {!sound.muted ? <VolumeUpIcon /> : <VolumeOffIcon />}
                      </NetflixIconButton>
                      <MaturityRate
                        sx={onProjects ? {
                          fontSize: { xs: 14, sm: 22 },
                          py: { xs: 0.5, sm: 1 },
                          pl: { xs: 1, sm: 1.5 },
                          pr: { xs: 1.5, sm: 3 },
                        } : undefined}
                      >
                        {`${maturityRate}+`}
                      </MaturityRate>
                    </Stack>
                  )}
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: "100%",
                  height: "100%",
                }}
              >
                <Stack
                  spacing={4}
                  sx={{
                    bottom: "35%",
                    position: "absolute",
                    left: { xs: "4%", md: "60px" },
                    top: 0,
                    width: "36%",
                    zIndex: 10,
                    justifyContent: "flex-end",
                  }}
                >
                    <MaxLineTypography variant="h2" maxLine={1} color="text.primary">
                        {computedTitle}
                    </MaxLineTypography>
                    <MaxLineTypography variant="h5" maxLine={3} color="text.primary">
                        {computedText}
                    </MaxLineTypography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <PlayButton
                      appearance="hero"
                      label="Resume"
                      href="https://drive.google.com/file/d/1Hgc63RAADimxVNR5J9G2Olh3kuhESCYx/view?usp=drive_link"
                      newTab
                      sx={onProjects ? { px: { xs: 1, sm: 2 }, py: { xs: 0.25, sm: 1 }, fontSize: { xs: 13, sm: 24, md: 28 }, minWidth: { xs: 0, sm: 'auto' }, maxWidth: { xs: 'fit-content', sm: 'none' } } : undefined}
                    />
                    <MoreInfoButton
                      sx={onProjects ? { px: { xs: 1, sm: 2 }, py: { xs: 0.25, sm: 1 }, fontSize: { xs: 13, sm: 24, md: 28 }, minWidth: { xs: 0, sm: 'auto' }, maxWidth: { xs: 'fit-content', sm: 'none' } } : undefined}
                      {...(video ? { onClick: () => setDetailType({ mediaType, id: video.id }) } : {})}
                    />
                  </Stack>
                </Stack>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
