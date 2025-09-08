# My Portfolio (Next.js)

A personal portfolio built with Next.js App Router, React, Material UI (MUI), Redux Toolkit, slick carousel, and video.js. The site includes cinematic hero sections, a Projects page with desktop sliders and a mobile-friendly stacked view, and tunable UI behaviors.

<p align="center">
  <img alt="Home" src="./public/assets/home-page.png" width="820" />
</p>

## Quick Start

- Node: 18+ (Next 15 / React 19)
- Install: `pnpm i` or `yarn` or `npm i`
- Dev: `pnpm dev` (or `npm run dev`) — runs Next with Turbopack
- Build: `pnpm build`
- Start: `pnpm start`

Scripts live in `package.json`.

## Environment Variables

Create a `.env.local` in `my-portfolio` with:

- `NEXT_PUBLIC_TMDB_V3_API_KEY` — TMDB API key (used by discover slices)
- `NEXT_PUBLIC_API_ENDPOINT_URL` — optional API base if needed

Constants are read in `src/constant/index.ts`.

## Project Structure (selected)

- `src/app` — App Router pages and layouts
  - `layout.tsx` — global metadata, providers, theme registry
  - `projects/page.tsx` — Projects view (desktop sliders, mobile stacked)
  - `favicon.ico` — default favicon picked up by Next
- `src/components` — UI components (HeroSection, DetailModal, Header, etc.)
- `src/store` — Redux Toolkit slices and RTK Query endpoints
- `src/constant` — shared constants
  - `index.ts` — base constants
  - `uiTweaks.ts` — central UI tuning (read-more timing, header gaps)
- `public/` — static assets (also supports `public/favicon.ico`)

## Key Features & Tuning

### Projects Page
- Desktop: section sliders via `withPagination(SlickSlider, ...)` in `src/app/projects/page.tsx`.
- Mobile: stacked inline detail cards (`InlineDetailCard`) rendered under section headers.

### Read more / Read less
- Desktop modal: smooth open downward using `max-height`, no upward jump.
- Mobile stacked cards: same approach, with a gentle gradient fade.
- Tune globally in `src/constant/uiTweaks.ts`:
  - `UI_TWEAKS.readMore.desktop.openTransition`
  - `UI_TWEAKS.readMore.desktop.closeTransition`
  - `UI_TWEAKS.readMore.mobile.openTransition`
  - `UI_TWEAKS.readMore.mobile.closeTransition`
  - Toggle visibility/underline with `UI_TWEAKS.readMore.*.show/underline`.

Relevant files:
- Desktop modal: `src/components/DetailModal.tsx`
- Mobile stacked: `src/components/InlineDetailCard.tsx`

<p align="center">
  <img alt="Detail Modal" src="./public/assets/detail-modal.png" width="820" />
</p>

### Header spacing (Search ↔ Account)
Adjust spacing specifically for the Projects page:
- `src/constant/uiTweaks.ts`
  - `projectsHeader.mobile.searchAccountGap`
  - `projectsHeader.mobile.accountRightMargin`
  - `projectsHeader.desktop.searchAccountGap`
  - `projectsHeader.desktop.accountRightMargin`
Used in `src/components/layouts/MainHeader.tsx`.

### Hero buttons and maturity badge sizing
- Responsive sizing applied in `src/components/HeroSection.tsx` so mobile `/projects` shows smaller buttons and `18+` badge.
- `src/components/MaturityRate.tsx` supports `sx` overrides.

## More Previews

<p align="center">
  <img alt="Grid Genre" src="./public/assets/grid-genre.png" width="820" />
</p>

<p align="center">
  <img alt="Mini Portal" src="./public/assets/mini-portal.png" width="820" />
</p>

<p align="center">
  <img alt="Watch" src="./public/assets/watch.png" width="820" />
</p>

## Favicon
Next picks the favicon from either of:
- `src/app/favicon.ico` (preferred in App Router)
- `public/favicon.ico`

Replace either file and redeploy. If browsers cache the old icon, hard-refresh (Cmd/Ctrl+Shift+R) or bump the filename and reference via metadata `icons` if needed.

## Deployment (Vercel)
- Ensure env vars are set in the Vercel project (especially `NEXT_PUBLIC_TMDB_V3_API_KEY`).
- Push to your Git provider; Vercel will build with Turbopack.

## Notes
- Path aliases use `src/` imports.
- Some UI relies on client components; avoid SSR/CSR mismatches by favoring responsive CSS over runtime media queries for size-only changes.

## License
No license specified. Add one if you plan to open-source.
