# Cryptopedia / Crypto通

An HK‑centric crypto encyclopedia for prices, context, and learning — built with Next.js.

## Overview

Cryptopedia (Crypto通) is a Hong Kong–focused crypto information hub for retail users and beginners who want a clean way to explore market data, understand assets, and follow relevant local developments.

The app provides a live market overview, asset pages, “new coins” discovery, exchange/wallet comparison, Hong Kong‑centric news, and structured educational guides. It’s designed to be approachable, while still offering data‑driven pages that experienced users can use as a starting point for deeper research.

This project is **information and education only**: no private keys, no trading execution, and no custody.

## Features

- **Live market overview**: prices, % changes, volume, market cap, sortable tables, responsive UI
- **Asset detail pages**: per‑asset pages with charts and key stats
- **Charts**: interactive chart views with common timeframes and indicators (where available)
- **New coins discovery**: newly listed / trending assets pages for exploration
- **Exchanges & wallets**: comparison pages and filters for common selection criteria
- **Hong Kong news focus**: HK‑relevant regulatory / market updates surfaced in a dedicated section
- **Educational guides**: structured guides covering basics → advanced concepts
- **Watchlist**: quick tracking for selected assets (local persistence)
- **Auth (coming soon)**: placeholder flows/pages for future sign‑in (e.g., Google)
- **Ad‑friendly layout**: sponsor placements/slots designed to be non‑intrusive and clearly labeled

## Tech stack

- **Framework**: Next.js (App Router), React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data source**: CoinGecko API (with an internal caching layer)
- **Deployment**: AWS Lightsail (single instance today; designed to scale later)
- **Analytics/monitoring (optional placeholders)**: Google Analytics / Plausible / Sentry (IDs/config via env)

## Getting started (local development)

### Prerequisites

- **Node.js**: 18+ (recommended: latest LTS)
- **Package manager**: npm (or pnpm/yarn — pick one and be consistent)

### Setup

1) Clone:

```bash
git clone <your-repo-url>
cd crypto-info
```

2) Install dependencies:

```bash
npm install
```

3) Configure environment variables:

```bash
cp .env.local.example .env.local 2>/dev/null || true
# Or create .env.local manually (see "Environment configuration" below)
```

4) Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

### Production build (local)

```bash
npm run build
npm run start
```

## Environment configuration

Create a `.env.local` file in the project root. Use **generic placeholders** (do not commit real secrets).

Common values:

```bash
# Public site URL (used for metadata, canonical URLs, and share links)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# CoinGecko configuration
COINGECKO_API_BASE_URL=https://api.coingecko.com/api/v3
# Optional: if you use a paid plan or a proxy in front of CoinGecko
COINGECKO_API_KEY=your_key_if_applicable

# Optional: caching / rate-limit tuning (exact behavior depends on implementation)
COINGECKO_CACHE_TTL_SECONDS=60
COINGECKO_RATE_LIMIT_RPS=5

# Optional: analytics (choose one)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=example.com

# Optional: monitoring
SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
```

Notes:
- **Never** commit `.env.local`.
- If you add new required env vars, update this section (and consider adding an `.env.local.example`).

## Architecture overview

- **Next.js app structure**: This is a Next.js **App Router** project. Routes live under `app/`, with shared UI in `app/layout.tsx` and reusable UI in `components/`. Pages frequently compose a shared shell (e.g., `PageShell`) and “coming soon” placeholders (e.g., `ComingSoonSection`) for unfinished areas.

- **Data layer & caching**: Market data is sourced from CoinGecko through server-side API routes under `app/api/`. Requests are cached to reduce latency and limit upstream calls. Caching is designed to keep “fast-moving” endpoints fresh while avoiding unnecessary refetches.

- **Deployment (AWS Lightsail)**: The app is deployed as a standard Next.js Node process on a Lightsail instance. Today it runs as a single instance; the code is structured to allow later scaling (e.g., external cache, CDN, multiple instances behind a load balancer).

## Development & coding conventions

- **TypeScript-first**: prefer explicit types for public functions and shared data structures.
- **Linting/formatting**: run lint before opening a PR.

```bash
npm run lint
```

- **Commits/PRs**: use a conventional prefix to keep history readable:
  - `feat:` new user-facing functionality
  - `fix:` bug fixes
  - `refactor:` non-functional changes
  - `chore:` tooling/deps
  - `docs:` documentation

- **Tests**: if/when a test runner is configured, add and run tests for non-trivial logic changes.

## Roadmap / planned improvements

- **Real authentication** (replace placeholders) and synced user settings
- **Richer watchlist/portfolio** (still non-custodial; user-owned data only)
- **Deeper HK regulatory coverage** (more sources, better tagging, timelines)
- **More localization** (broader Chinese coverage and improved terminology consistency)
- **Performance & caching** (stronger cache invalidation, edge/CDN strategy, better rate-limit handling)

## Disclaimer

Cryptopedia / Crypto通 is provided **for informational and educational purposes only**. It does not constitute investment advice, financial advice, trading advice, or any other kind of professional advice. You are solely responsible for your investment decisions and should do your own research (DYOR).

## License

License: **TBA**.