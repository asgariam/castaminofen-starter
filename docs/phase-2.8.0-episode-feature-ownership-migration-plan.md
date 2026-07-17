# Phase 2.8.0 — Episode Feature Ownership Migration Plan

## Status

Planning only / no implementation

## Objective

Analyze the current episode implementation and define a migration plan to move episode-specific ownership from the route layer into the Episode feature boundary without changing runtime behavior, routes, API contracts, or UI structure.

## Current State

### Current route responsibilities

The route layer still owns most of the episode-specific orchestration:

- [apps/web/src/app/episodes/[id]/page.tsx](../apps/web/src/app/episodes/[id]/page.tsx)
  - reads route params
  - fetches episode data via React Query
  - manages local file selection state
  - handles upload mutation and success/error feedback
  - composes the page UI directly in the route file

- [apps/web/src/app/episodes/new/page.tsx](../apps/web/src/app/episodes/new/page.tsx)
  - defines the form schema with Zod
  - initializes React Hook Form
  - loads podcasts for selection
  - handles create submission and redirect flow
  - owns the page-level error state

### Current feature responsibilities

The Episode feature folder already exists, but its ownership is still partial:

- [apps/web/src/features/episodes/EpisodeForm.tsx](../apps/web/src/features/episodes/EpisodeForm.tsx)
  - currently acts as a reusable presentational wrapper for form UI
  - does not own form state, validation, or submission logic

- [apps/web/src/features/episodes/EpisodeCard.tsx](../apps/web/src/features/episodes/EpisodeCard.tsx)
  - currently provides a simple presentation component for episode listing cards
  - does not manage data fetching or page-level behavior

### Current shared responsibilities

The shared layer remains responsible for the thin data access boundary:

- [apps/web/src/lib/episodes.ts](../apps/web/src/lib/episodes.ts)
  - provides API wrappers for get, create, and upload actions
  - is still a shared data layer and should remain a thin adapter rather than a place for page-specific UI logic

Other shared responsibilities remain outside the feature boundary:

- shared UI primitives such as form/input/button/loading/error components
- app-level route wrappers and layout infrastructure
- shared types and generic API utilities

## Migration Candidates

### UI composition to move

The following presentation responsibilities are good candidates for feature ownership:

- the episode details layout for the detail page
- the audio upload panel and its state-driven UI feedback
- the create episode form container and its field arrangement
- the “new episode” page composition around the form

### Hooks to extract

The following logic should be extracted into feature-local hooks when the migration begins:

- `useEpisodeDetails` for detail page data loading and upload orchestration
- `useEpisodeUpload` for upload mutation state and success/error handling
- `useCreateEpisodeForm` or `useEpisodeForm` for form initialization, validation, submit flow, and page-level error handling

### Validation logic to move

The current Zod schema in [apps/web/src/app/episodes/new/page.tsx](../apps/web/src/app/episodes/new/page.tsx) is a strong candidate for movement into the feature boundary:

- move the schema into a feature-local validator module
- keep the route page responsible only for composition and navigation

### Local state candidates

The following state is currently route-owned and should be moved into the feature layer as part of the migration:

- selected file state for audio upload
- form-level error state for episode creation
- submission/loading state for the form and upload flow
- any derived UI state tied to the episode-specific page experience

## Target Structure

The future structure should be centered around a clearer Episode feature boundary:

```text
features/episodes/
├── components/
│   ├── EpisodeDetailView.tsx
│   ├── EpisodeUploadPanel.tsx
│   └── EpisodeCreateForm.tsx
├── hooks/
│   ├── useEpisodeDetails.ts
│   ├── useEpisodeUpload.ts
│   └── useCreateEpisodeForm.ts
├── validators/
│   └── episodeSchema.ts
└── types/
    └── episode.ts
```

This proposal keeps the route layer focused on page entry and navigation while moving episode-specific behavior into the feature folder.

## Migration Order

### 1. First migration target

Move the create-episode flow into the Episode feature boundary first.

Why first:

- it already has a clear feature component placeholder in [apps/web/src/features/episodes/EpisodeForm.tsx](../apps/web/src/features/episodes/EpisodeForm.tsx)
- it has a concentrated set of responsibilities: schema, form state, submit flow, and error handling
- it is easier to isolate than the detail page upload workflow

### 2. Second migration target

Move the episode detail page ownership into the Episode feature boundary.

This should include:

- extracting the detail view composition
- moving upload UI and mutation handling into an episode-specific hook/component pair
- keeping the page file as a thin route container

### 3. Verification step

After each migration step, verify that:

- route URLs remain unchanged
- the feature still renders correctly
- query and mutation behavior remain intact
- no shared data-layer contract is broken

## Risk Assessment

### Runtime risks

- upload and create flows could regress if state handling is moved too aggressively
- query invalidation and redirect behavior must remain intact

### Coupling risks

- the route page currently depends on query hooks, route params, and protected-route wrappers; if those responsibilities are moved too early, the feature boundary may become unnecessarily coupled to routing details

### API risks

- the shared API wrapper in [apps/web/src/lib/episodes.ts](../apps/web/src/lib/episodes.ts) should remain a thin adapter; moving API concerns into the feature layer too early could duplicate logic or create inconsistent patterns

### State risks

- local UI state such as selected files and form errors should be feature-owned, but they must remain scoped to the episode experience rather than leaking into global state

## Final Decision

READY FOR IMPLEMENTATION

Reason:

The current implementation already has a clear migration seam: the route layer owns orchestration while the Episode feature folder already contains reusable presentation components. The ownership boundaries are specific enough to begin the migration in a controlled, incremental way without requiring additional architectural analysis.
