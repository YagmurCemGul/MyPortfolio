// src/data/projects.ts
// Build lightweight rows for HomePage from PROJECT_SECTIONS
import { PROJECT_SECTIONS } from "./myProjects";

type Row = {
  title: string;
  items: Array<{
    id: string;
    title: string;
    overview: string;
    posterUrl?: string;
    year?: string | number;
    tech?: string[];
    href?: string;
  }>;
};

export const PROJECT_ROWS: Row[] = PROJECT_SECTIONS.map((sec) => ({
  title: sec.name,
  items: sec.textOverrides
    .filter((ov) => (ov.title ?? "").trim() && (ov.backdrop_path ?? "").trim())
    .map((ov) => ({
      id: (ov.title ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      title: ov.title ?? "",
      overview: ov.overview ?? "",
      posterUrl: ov.backdrop_path ?? "",
      year: ov.year ?? (ov.release_date ? String(ov.release_date).slice(0, 4) : undefined),
      tech: Array.isArray(ov.skills) ? (ov.skills as string[]) : [],
      href: ov.href ?? undefined,
    })),
}));

