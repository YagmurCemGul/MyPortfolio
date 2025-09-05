"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import PlayButton from "./PlayButton";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { UI_TWEAKS } from "src/constant/uiTweaks";
import NetflixIconButton from "./NetflixIconButton";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { useState, useMemo, useEffect, useRef } from "react";
import { getPlayLinkForTitle } from "src/utils/links";
import { useSound } from "src/providers/SoundProvider";
import { getSoundForTitle } from "src/utils/sounds";
import { loadCounters, saveCounters, CardCounters } from "src/utils/userCounters";

export interface InlineDetailItem {
  title: string;
  overview: string;
  backdrop_path: string;
  href?: string;
  skills?: string[];
  availableIn?: string | string[];
}

export default function InlineDetailCard({ item }: { item: InlineDetailItem }) {
  const playHref = getPlayLinkForTitle(item.title, item.href);
  const availableText = Array.isArray(item.availableIn)
    ? item.availableIn.join(", ")
    : (item.availableIn ?? "English");
  const [counters, setCounters] = useState<CardCounters>({ liked: false, added: false, likedCount: 0, addedCount: 0 });
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const sound = useSound();
  const soundSrc = useMemo(() => getSoundForTitle(item.title), [item.title]);
  const animRef = useRef<HTMLDivElement | null>(null);
  const [animating, setAnimating] = useState(false);
  const [animDir, setAnimDir] = useState<'open' | 'close'>('open');

  useEffect(() => {
    if (!item.title) return;
    const c = loadCounters(item.title);
    setCounters(c);
  }, [item.title]);

  return (
    <Box sx={{ bgcolor: "#111", borderRadius: 2, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
      {/* Media */}
      <Box sx={{ position: "relative", pt: "56.25%" }}>
        {item.backdrop_path && (
          <img
            src={item.backdrop_path}
            alt={item.title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />)
        }
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>{item.title}</Typography>
        {/* Smooth expandable text (mobile and desktop) */}
        <Box sx={{ position: 'relative', mt: 0.25 }}>
          <Box
            ref={animRef}
            sx={{
              overflow: 'hidden',
              maxHeight: expanded ? 2000 : 72, // ~3-4 lines
              transition: (isMobile
                ? (animDir === 'open' ? UI_TWEAKS.readMore.mobile.openTransition : UI_TWEAKS.readMore.mobile.closeTransition)
                : (animDir === 'open' ? UI_TWEAKS.readMore.desktop.openTransition : UI_TWEAKS.readMore.desktop.closeTransition)
              ),
              willChange: 'max-height',
            }}
            onTransitionEnd={() => setAnimating(false)}
          >
            <Typography variant="body2" color="text.primary" sx={{ opacity: 0.95, whiteSpace: 'pre-line' }}>
              {item.overview || ""}
            </Typography>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 28,
              pointerEvents: 'none',
              background: 'linear-gradient(180deg, rgba(17,17,17,0), rgba(17,17,17,0.92))',
              opacity: !expanded && !animating ? 1 : 0,
              transition: 'opacity 300ms ease',
            }}
          />
        </Box>
        {item.overview && item.overview.length > 0 && (
          <Link
            onClick={(e)=>{ e.preventDefault(); setAnimating(true); setAnimDir(expanded ? 'close' : 'open'); setExpanded((v)=>!v); }}
            underline="always"
            color="inherit"
            href="#"
            sx={{
              mt: 1,
              display: {
                xs: UI_TWEAKS.readMore.mobile.show ? 'inline-block' : 'none',
                md: UI_TWEAKS.readMore.desktop.show ? 'inline-block' : 'none',
              },
              fontWeight: 700,
              color: 'common.white',
              textDecoration: (isMobile ? UI_TWEAKS.readMore.mobile.underline : UI_TWEAKS.readMore.desktop.underline) ? 'underline' : 'none',
            }}
          >
            {expanded ? 'Read less' : 'Read more'}
          </Link>
        )}

        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ my: 1.5, flexWrap: 'wrap' }}>
          <PlayButton appearance="modal" label="Play" href={playHref} newTab />
          <NetflixIconButton
            aria-label="Added to List"
            onClick={() => setCounters(prev => { const added = !prev.added; const next = { ...prev, added, addedCount: Math.max(0, prev.addedCount + (added ? 1 : -1)) }; saveCounters(item.title, next); return next; })}
            sx={{ borderColor: counters.added ? 'primary.main' : 'grey.700' }}
            title={counters.added ? 'Added to List' : 'Add to List'}
          >
            {counters.added ? <CheckIcon /> : <AddIcon />}
          </NetflixIconButton>
          <NetflixIconButton
            aria-label="Like"
            onClick={() => setCounters(prev => { const liked = !prev.liked; const next = { ...prev, liked, likedCount: Math.max(0, prev.likedCount + (liked ? 1 : -1)) }; saveCounters(item.title, next); return next; })}
            sx={{ borderColor: counters.liked ? 'primary.main' : 'grey.700' }}
            title={counters.liked ? 'Liked' : 'Like'}
          >
            {counters.liked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
          </NetflixIconButton>
          {soundSrc && (
            <NetflixIconButton
              aria-label="Toggle sound"
              onClick={() => sound.toggle(soundSrc)}
              sx={{ borderColor: sound.muted ? 'grey.700' : 'primary.main' }}
              title={sound.muted ? 'Sound off' : 'Sound on'}
            >
              {sound.muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </NetflixIconButton>
          )}
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: -0.5 }}>
          {`Liked: ${counters.likedCount.toLocaleString()} • Added to List: ${counters.addedCount.toLocaleString()}`}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          {`Skills: ${(item.skills ?? []).join(', ')}`}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          {`Available in: ${availableText}`}
        </Typography>
      </Box>
    </Box>
  );
}
