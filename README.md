![MyPortfolio](https://socialify.git.ci/YagmurCemGul/MyPortfolio/image?custom_description=A+personal+portfolio+using+Next.js+App+Router+%2815%29%2C+React+19%2C+MUI%2C+Redux+Toolkit%2C+slick-carousel%2C+and+video.js.+Features+a+cinematic+hero%2C+a+Projects+page+with+desktop+sliders+and+a+mobile+stacked+layout%2C+plus+globally+tunable+UI+behaviors.&custom_language=JavaScript&description=1&font=Rokkitt&forks=1&issues=1&language=1&name=1&owner=1&pattern=Plus&pulls=1&stargazers=1&theme=Light)

# Netflix-Style Portfolio

> Cinematic, Netflix-inspired storytelling site built with Next.js App Router, Material UI, Redux Toolkit, slick sliders, and custom audio orchestration.

## :sparkles: Highlights
- Interactive intro that mirrors the Netflix splash, unlocks audio on first gesture, and routes visitors into curated personas
- Persona-aware dashboard that persists the selected profile and steers visitors toward tailored routes such as `/projects`, `/stalker`, and `/adventurer`
- Projects page with synchronized desktop carousels and mobile stacks, TMDB-style metadata, and a search bus that opens richly formatted detail cards
- Detail modal pipeline with `SoundProvider` toggles, Hero CTAs (`PlayButton`, `AgeLimitChip`, `QualityChip`), and GSAP-ready transitions for a cinematic feel
- Among Us inspired "Stalker" experience featuring star fields rendered client-side, timed lettering animations, and deferred audio playback

## :building_construction: Tech Stack
- Next.js 15 (App Router) on React 19 and TypeScript 5
- Material UI 5 with Emotion theming, custom typography via `next/font`, and PillNav shell navigation
- Redux Toolkit store, RTK Query-style slices, and context providers (`DetailModalProvider`, `SoundProvider`) for UI state sharing
- Slick Carousel + custom pagination HOC, GSAP, Framer Motion, and tsparticles for motion design
- Video.js with YouTube plugin for embedded trailers and media playback

## :rocket: Quick Start
1. Node 18 or newer (Turbopack requires the modern runtime)
2. Install dependencies: `pnpm install` (or `npm install` / `yarn`)
3. Run the dev server: `pnpm dev` (Next.js with Turbopack)
4. Build for production: `pnpm build`
5. Start the production server: `pnpm start`

### Environment Variables
Create `.env.local` in `my-portfolio` with the keys you need:
- `NEXT_PUBLIC_TMDB_V3_API_KEY` - optional, enables TMDB fetches alongside local overrides
- `NEXT_PUBLIC_API_ENDPOINT_URL` - optional remote data source if you externalize content

## :gear: Useful Scripts
- `pnpm dev` - start the Next.js dev server with Turbopack
- `pnpm build` - production build
- `pnpm start` - serve the production output
- `pnpm lint` - run ESLint across the project

## :file_folder: Project Structure
```text
src/
  app/                 # Next.js App Router routes (intro, accounts, projects, stalker, etc.)
  components/          # Reusable UI: HeroSection, DetailModal, InlineDetailCard, PillNav
  constant/            # UI tuning knobs (read more timing, header spacing)
  data/                # `myProjects.ts` - TMDB-like metadata powering carousels & detail cards
  hoc/withPagination/  # Slick slider wrapper that injects TMDB fetch + pagination state
  providers/           # Cross-cutting providers: detail modal, portals, audio
  store/               # Redux Toolkit slices, async thunks, and store bootstrap
  utils/               # Helpers for formatting durations, building media links, sounds
public/assets/         # Screens, gifs, audio cues used across the experience
```

## :compass: Key Modules
- `src/app/layout.tsx` - wraps the tree with Redux, Material UI registry, custom fonts, and preloaded audio assets
- `src/app/intro/page.tsx` - handles the Netflix-style splash, audio autoplay policies, and timed redirect to accounts
- `src/app/projects/page.tsx` - orchestrates hero banners, section sliders, mobile stacks, and global search events
- `src/data/myProjects.ts` - single source of truth for project blurbs, skills, gifs, and outbound links
- `src/providers/SoundProvider.tsx` - central audio toggler that synchronizes hero background soundtracks and modals
- `src/components/slick-slider/SlickSlider.tsx` - carousel shell with custom navigation injected by `withPagination`
- `src/components/DetailModal.tsx` - responsive detail drawer/modal with read-more gradients and CTA stack

## :bar_chart: Data-Driven Content
The site leans on TMDB-inspired metadata. Update `src/data/myProjects.ts` to adjust sections, copy, GIF backdrops, external links, and skill tags. Overrides funnel into both the carousel cards and the inline mobile cards, so updates stay consistent across layouts.

## :camera_flash: Screens & Motion
- `./public/assets/home-page.png` - landing hero
- `./public/assets/detail-modal.png` - detail modal with CTA stack
- `./public/assets/grid-genre.png` - desktop slider grid
- `./public/assets/mini-portal.png` - persona chooser
- `./public/assets/watch.png` - watch detail view

## :triangular_flag_on_post: Deployment Tips
- Vercel-friendly configuration via `vercel.json` and `next.config.ts`
- Ensure environment variables exist in your hosting provider (TMDB key, API endpoints)
- Swap the favicon by updating `src/app/favicon.ico` or `public/favicon.ico` before redeploying

## :construction: Roadmap Ideas
- Add automated snapshot tests for the hero, projects carousel, and detail modal states
- Layer in lazy TMDB fetches once an API key is available to blend live data with handcrafted narratives
- Expand persona-specific dashboards (developer vs recruiter) with tailored CTAs or analytics

## :memo: License
No open-source license specified. Add one before publishing the repository.

