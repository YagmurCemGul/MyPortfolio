// src/app/projects/page.tsx
"use client";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import HeroSection from "src/components/HeroSection";
import withPagination from "src/hoc/withPagination";
import SlickSlider from "src/components/slick-slider/SlickSlider";
import { MEDIA_TYPE } from "src/types/Common";
import { Genre } from "src/types/Genre";
import { PROJECT_SECTIONS } from "src/data/myProjects";
import { useDetailModal } from "src/providers/DetailModalProvider";
import PlayButton from "src/components/PlayButton";
import AgeLimitChip from "src/components/AgeLimitChip";
import QualityChip from "src/components/QualityChip";
import { formatMinuteToReadable } from "src/utils/common";
import { useSound } from "src/providers/SoundProvider";
import { getSoundForTitle } from "src/utils/sounds";
import { getPlayLinkForTitle } from "src/utils/links";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import IconButton from "@mui/material/IconButton";

const HERO_GIF = "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGplNWczYTFmeXliYzRnM28wZW1veGo3dDZlNDFybXBybWQ5YXg0byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QTsXzRkuj4PiRfDzYP/giphy.gif";

// TMDB genre id örnekleri: 28 Action, 12 Adventure, 18 Drama, 35 Comedy, 878 Sci-Fi, 27 Horror...
const GENRE_IDS = [28, 12, 18, 35, 878, 27, 53, 10749];

export default function Page() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { setDetailType } = useDetailModal();

  const flatOverrides = useMemo(() => {
    return PROJECT_SECTIONS.flatMap((sec) =>
      sec.textOverrides.map((ov) => ({
        section: sec.name,
        title: ov.title ?? "",
        overview: ov.overview ?? "",
        skills: ov.skills ?? [],
        backdrop_path: ov.backdrop_path ?? "",
        href: ov.href ?? "",
        availableIn: ov.availableIn ?? "English",
      }))
    ).filter((x) => x.title && x.backdrop_path);
  }, []);

  useEffect(() => {
    const onSearch = (e: any) => {
      const q = String(e?.detail?.q || "").toLowerCase();
      if (!q) return;
      const hit = flatOverrides.find(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          it.overview.toLowerCase().includes(q) ||
          (Array.isArray(it.skills)
            ? it.skills.join(" ").toLowerCase().includes(q)
            : false)
      );
      if (hit) {
        setDetailType({
          override: {
            title: hit.title,
            overview: hit.overview,
            backdrop_path: hit.backdrop_path,
            href: hit.href,
            skills: hit.skills as string[],
            availableIn: hit.availableIn,
          },
        });
      }
    };
    window.addEventListener("projects:search", onSearch as EventListener);
    try {
      const pending = sessionStorage.getItem("pendingProjectsSearch");
      if (pending) {
        onSearch({ detail: { q: pending } });
        sessionStorage.removeItem("pendingProjectsSearch");
      }
    } catch {}
    return () =>
      window.removeEventListener("projects:search", onSearch as EventListener);
  }, [flatOverrides, setDetailType]);

  // About open event from header
  useEffect(() => {
    const onAbout = () => {
      const about = flatOverrides.find((x) => x.section == "About Me");
      if (!about) return;
      setDetailType({
        override: {
          title: about.title,
          overview: about.overview,
          backdrop_path: about.backdrop_path,
          href: about.href,
          skills: about.skills as string[],
          availableIn: about.availableIn,
        },
      });
    };
    window.addEventListener("projects:about", onAbout);
    return () => window.removeEventListener("projects:about", onAbout);
  }, [flatOverrides, setDetailType]);

  // Slower smooth scroll handler from header
  useEffect(() => {
    const onScrollReq = (e: any) => {
      const id = e?.detail?.id || 'projects-list';
      const el = document.getElementById(id) || document.getElementById('projects-root');
      if (!el) return;
      const duration = 1400; // ms
      const startY = window.scrollY || window.pageYOffset;
      const targetY = el.getBoundingClientRect().top + startY;
      const diff = targetY - startY;
      let start: number | null = null;
      const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
      const step = (ts: number) => {
        if (start === null) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = easeInOutQuad(progress);
        window.scrollTo({ top: startY + diff * eased, behavior: 'auto' });
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    window.addEventListener('projects:scroll', onScrollReq as EventListener);
    return () => window.removeEventListener('projects:scroll', onScrollReq as EventListener);
  }, []);

  return (
    <Stack spacing={2} id="projects-root">
      <HeroSection
        mediaType={MEDIA_TYPE.Movie}
        heroImageUrl={HERO_GIF}
        heroTitle="Impact Works"
        heroText="Blending game dev, digital strategy, and project leadership to create innovative solutions with proven impact."
      />
      {/* Anchor to scroll below the hero */}
      <div id="projects-list" />
      {PROJECT_SECTIONS.map((section, idx) => {
        const genreId = GENRE_IDS[idx % GENRE_IDS.length]; // benzersiz cache anahtarı sağlar
        const genre: Genre = { id: genreId, name: section.name }; // başlık senin, fetch TMDB'den
        const SectionSlider = withPagination(SlickSlider, MEDIA_TYPE.Movie, genre);
        return (
          <SectionSlider key={section.key} textOverrides={section.textOverrides} />
        );
      })}
    </Stack>
  );
}

