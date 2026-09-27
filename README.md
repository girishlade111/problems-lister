# Problems Lister

A drag-and-drop "problems" tracker web app. Add the things weighing on your mind, reorder them by priority with drag-and-drop, and watch a live priority indicator that reflects how many problems you're carrying — all stored privately in your browser's local storage.

## What it does

- **List your problems** — add short entries describing what's on your mind
- **Drag-and-drop reordering** — rank problems by priority with a smooth DnD interface (@dnd-kit)
- **Priority indicator** — a color-coded status badge based on the number of active problems:
  - 10+ → Critical (red)
  - 7–9 → High (orange)
  - 4–6 → Medium (yellow)
  - 1–3 → Low (green)
  - 0 → None
- **Welcome dialog** — onboarding modal on first visit
- **Local-first privacy** — problems persist in `localStorage`; nothing ever leaves the browser
- **Dark glassmorphism UI** — responsive design with animated list transitions (framer-motion) and shadcn/ui components

## Features

- Add / delete / clear-all problems
- Keyboard-accessible drag sorting (sortable keyboard coordinates)
- Animated add/remove transitions
- Responsive layout (mobile → desktop)
- Dark mode UI via next-themes

## Tech stack

- **Framework:** Next.js 15 (App Router, static export)
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS, shadcn/ui (Radix primitives), lucide-react icons
- **Motion:** framer-motion
- **Drag & drop:** @dnd-kit/core, @dnd-kit/sortable
- **Forms/validation:** react-hook-form, zod
- **Persistence:** browser localStorage (custom `useLocalStorage` / `useProblemsStore` hooks)
- **Package manager:** pnpm

## Quick start

```bash
# install dependencies
pnpm install
# or: npm install --legacy-peer-deps

# run the dev server
pnpm dev        # http://localhost:3000

# production build (static export -> ./out)
pnpm build

# serve the static export
npx serve out
```

## Project structure

```
app/
  page.tsx            # main problems list UI (client component)
  layout.tsx          # root layout, theme provider
  globals.css         # global styles + Tailwind
components/
  ui/                 # shadcn/ui primitives (button, dialog, input)
  welcome-dialog.tsx  # first-visit onboarding modal
  theme-provider.tsx
hooks/
  use-problems-store.ts  # add/delete/reorder/clear problems logic
  use-local-storage.ts   # localStorage-backed state hook
lib/
  utils.ts            # cn() classnames helper
public/               # static assets
```

## Environment variables

None — the app is fully client-side and needs no secrets or config.

## Deployment

The app is statically exported (`output: "export"` in `next.config.mjs`), so it can be hosted anywhere static files are served.

- **GitHub Pages (current):** https://girishlade111.github.io/problems-lister/
- **Vercel (original v0 deployment):** see the Vercel dashboard link in the project settings

Note: when deploying under a subpath (e.g. GitHub Pages `/problems-lister/`), the config uses `basePath: "/problems-lister"`. Remove `basePath` when deploying to a custom domain or root path.

Originally generated with [v0.app](https://v0.app).

## License

Open source — free to use and modify.

---

Built by Girish Lade — https://ladestack.in
