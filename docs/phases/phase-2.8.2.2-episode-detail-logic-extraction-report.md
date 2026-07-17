# Phase 2.8.2.2 - Episode Detail Logic Extraction Report

## Objective
Move episode detail data loading and audio upload orchestration from the route layer into feature-local hooks while preserving routes, URL patterns, query keys, API contracts, and UI behavior.

## Scope
- Extract detail query ownership into the Episode feature boundary
- Extract audio upload workflow and local file state into the Episode feature boundary
- Keep the route page responsible for page entry, params, and composition only

## Implemented Work
- Added feature-local hook for episode detail querying in [apps/web/src/features/episodes/hooks/useEpisodeDetail.ts](../apps/web/src/features/episodes/hooks/useEpisodeDetail.ts)
- Added feature-local hook for episode audio upload state and mutation flow in [apps/web/src/features/episodes/hooks/useEpisodeAudioUpload.ts](../apps/web/src/features/episodes/hooks/useEpisodeAudioUpload.ts)
- Updated [apps/web/src/app/episodes/[id]/page.tsx](../apps/web/src/app/episodes/[id]/page.tsx) to compose the page using the new hooks

## Files Changed
- [apps/web/src/app/episodes/[id]/page.tsx](../apps/web/src/app/episodes/[id]/page.tsx)
- [apps/web/src/features/episodes/hooks/useEpisodeDetail.ts](../apps/web/src/features/episodes/hooks/useEpisodeDetail.ts)
- [apps/web/src/features/episodes/hooks/useEpisodeAudioUpload.ts](../apps/web/src/features/episodes/hooks/useEpisodeAudioUpload.ts)

## Ownership Model
- Route owns params, page entry, and composition
- Feature owns episode query orchestration, upload workflow, and local interaction state
- Shared layer remains responsible for API transport and UI primitives

## Validation Results
- Lint: passed via pnpm --filter @castaminofen/web lint
- Build: passed via pnpm --filter @castaminofen/web build

## Runtime Impact
- No route changes
- No URL changes
- No API contract changes
- No query key changes
- No UI behavior changes expected
