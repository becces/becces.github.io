# Workspace

## Overview

pnpm workspace monorepo using TypeScript. A personal music streaming website — stream-only, no downloads.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite (music-streaming artifact)

## Artifacts

- **music-streaming** (`/`) — React + Vite music streaming frontend with persistent audio player
- **api-server** (`/api`) — Express API server for tracks, albums, artist info

## Music Streaming App

A Spotify-style personal music streaming website. Visitors can stream the artist's music but cannot download tracks.

### Features
- Home page with hero section and featured tracks
- Full music library with search
- Albums grid and detail pages
- Artist bio/about page
- Persistent bottom audio player (play/pause, seek, volume, queue)
- Download prevention (no download attribute, no right-click save)

### Database Schema
- `albums` — album info (title, cover, year, genre)
- `tracks` — track info with audioUrl, duration, album reference
- `artist` — single artist profile row

### Customization
To add your own music, update the `audio_url` column in the `tracks` table with your actual audio file URLs. Similarly update album cover images and artist profile data in the database.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/music-streaming run dev` — run frontend locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
