"use client";

import { useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { styled, alpha, useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import { PROJECT_SECTIONS } from "src/data/myProjects";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    width: "100%",
    display: "flex",
    alignItems: "center",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    cursor: "pointer",
    padding: theme.spacing(0, 1),
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    // MUI'nin input class'ı:
    "& .MuiInputBase-input": {
        width: 0,
        padding: theme.spacing(0.75, 1),
        transition: theme.transitions.create("width", {
            duration: theme.transitions.duration.complex,
            easing: theme.transitions.easing.easeIn,
        }),
        // Odaklanınca genişlet
        "&:focus": {
            width: 220, // px cinsinden sabit bir genişlik daha sorunsuz çalışır
        },
    },
}));

export default function SearchBox() {
    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [query, setQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    const entries = useMemo(() => {
        return PROJECT_SECTIONS.flatMap(sec =>
            sec.textOverrides.map(ov => ({
                section: sec.name,
                title: ov.title ?? "",
                overview: ov.overview ?? "",
                skills: (ov.skills ?? []) as string[],
            }))
        ).filter(x => x.title);
    }, []);

    const suggestions = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [] as Array<any>;

        // Small Damerau-Levenshtein with early cutoff (max 2 edits)
        const dlDistance = (a: string, b: string, max = 2) => {
            const al = a.length, bl = b.length;
            if (Math.abs(al - bl) > max) return max + 1;
            const dp: number[] = Array(bl + 1).fill(0);
            for (let j = 0; j <= bl; j++) dp[j] = j;
            for (let i = 1; i <= al; i++) {
                let prev = dp[0];
                dp[0] = i;
                let minRow = dp[0];
                for (let j = 1; j <= bl; j++) {
                    const tmp = dp[j];
                    const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                    dp[j] = Math.min(
                        dp[j] + 1,
                        dp[j - 1] + 1,
                        prev + cost,
                    );
                    prev = tmp;
                    if (dp[j] < minRow) minRow = dp[j];
                }
                if (minRow > max) return max + 1;
            }
            return dp[bl];
        };

        const fuzzyScore = (text: string, q: string) => {
            const t = text.toLowerCase();
            if (!t) return 0;
            if (t.includes(q)) return 3 + (t.startsWith(q) ? 1 : 0);
            // subsequence bonus
            let i = 0, j = 0, match = 0;
            while (i < t.length && j < q.length) { if (t[i++] === q[j]) { j++; match++; } }
            const subseq = match / Math.max(1, q.length);
            const dist = dlDistance(t.slice(0, Math.min(t.length, q.length + 3)), q, 2); // small window
            const editBonus = dist <= 2 ? (2 - dist) * 0.8 : 0;
            return (subseq >= 0.6 ? 1.2 * subseq : 0) + editBonus; // up to ~2
        };

        const scored = entries
            .map((it) => {
                const titleS = fuzzyScore(it.title, q);
                const overviewS = fuzzyScore(it.overview, q) * 0.6;
                const skillMatches = it.skills.filter((s) => fuzzyScore(s, q) > 0.6);
                const skillsS = Math.min(3, skillMatches.length * 1.0);
                const score = titleS * 3 + skillsS * 2 + overviewS; // title dominates, then skills
                return { ...it, score, matchedSkills: skillMatches.slice(0, 3) };
            })
            .filter((it) => it.score > 0.2)
            .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
        return scored.slice(0, 6);
    }, [entries, query]);

    const highlight = (text: string, q: string) => {
        const key = q.trim();
        if (!key) return text;
        const idx = text.toLowerCase().indexOf(key.toLowerCase());
        if (idx === -1) return text;
        const before = text.slice(0, idx);
        const match = text.slice(idx, idx + key.length);
        const after = text.slice(idx + key.length);
        return (
            <>
                {before}
                <mark
                    style={{
                        background: alpha(theme.palette.primary.main, 0.35),
                        color: theme.palette.common.white,
                        padding: 0,
                        borderRadius: 2,
                    }}
                >
                    {match}
                </mark>
                {after}
            </>
        );
    };

    const handleClickSearchIcon = () => {
        if (!isFocused) {
            searchInputRef.current?.focus();
        }
    };

    return (
        <Search
            sx={
                isFocused
                    ? { border: "1px solid white", backgroundColor: "black" }
                    : undefined
            }
        >
            <SearchIconWrapper onClick={handleClickSearchIcon}>
                <SearchIcon />
            </SearchIconWrapper>

            <StyledInputBase
                inputRef={searchInputRef}
                placeholder="Titles, people, genres"
                inputProps={{
                    "aria-label": "search",
                    onFocus: () => setIsFocused(true),
                    onBlur: () => setTimeout(() => setIsFocused(false), 120),
                    onChange: (e: any) => setQuery(e.target.value),
                    onKeyDown: (e: any) => {
                        if (e.key === 'Enter') {
                            const q = (e.currentTarget?.value || '').trim();
                            if (!q) return;
                            try { window.dispatchEvent(new CustomEvent('projects:search', { detail: { q } })); } catch {}
                            if (!pathname?.startsWith('/projects')) {
                                try { sessionStorage.setItem('pendingProjectsSearch', q); } catch {}
                                router.push('/projects');
                            }
                        }
                    }
                }}
            />

            {isFocused && suggestions.length > 0 && (
                <Paper
                    elevation={6}
                    sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        mt: 1,
                        width: 280,
                        maxHeight: 320,
                        overflowY: "auto",
                        bgcolor: "#0f0f0f",
                        color: "#fff",
                        zIndex: 1200,
                        border: "1px solid rgba(255,255,255,0.15)",
                    }}
                >
                    <List dense disablePadding>
                        {suggestions.map((sug: any, idx: number) => (
                            <ListItemButton
                                key={`${sug.section}-${sug.title}-${idx}`}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                    const q = sug.title;
                                    try { window.dispatchEvent(new CustomEvent('projects:search', { detail: { q } })); } catch {}
                                    if (!pathname?.startsWith('/projects')) {
                                        try { sessionStorage.setItem('pendingProjectsSearch', q); } catch {}
                                        router.push('/projects');
                                    }
                                    setIsFocused(false);
                                }}
                            >
                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                                        {highlight(sug.title, query)}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center', mt: 0.5 }}>
                                        <Chip
                                            label={sug.section}
                                            size="small"
                                            color="default"
                                            variant="filled"
                                            sx={{ bgcolor: '#1f2937', color: '#fff' }}
                                        />
                                        {(sug.matchedSkills as string[]).map((ms: string) => (
                                            <Chip key={ms} label={highlight(ms, query)} size="small" variant="filled" sx={{ bgcolor: '#374151', color: '#fff' }} />
                                        ))}
                                    </Box>
                                </Box>
                            </ListItemButton>
                        ))}
                    </List>
                </Paper>
            )}

        </Search>
    );
}
