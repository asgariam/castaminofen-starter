# Phase 2.8.2 — Episode Detail Migration Plan

## Status
Planning only. No implementation, no file changes, no code movement, no behavior changes.

## Objective
Analyze the current Episode Detail route implementation and define a safe migration plan to move episode-specific ownership from the route layer into the Episode feature boundary while preserving:

- runtime behavior
- route paths and URLs
- API contracts
- UI behavior
- the existing shared data layer

## Current State

### Route responsibilities
The current route at [apps/web/src/app/episodes/[id]/page.tsx](../../apps/web/src/app/episodes/[id]/page.tsx) is currently responsible for several concerns:

- Data fetching
  - Uses React Query to load the episode by ID.
  - Uses the shared helper from [apps/web/src/lib/episodes.ts](../../apps/web/src/lib/episodes.ts) for fetching.

- Route params usage
  - Reads the episode ID from the dynamic route param via `useParams()`.
  - This is route-level input and should remain the responsibility of the page entry point during migration.

- Mutation handling
  - Handles the audio upload mutation and invalidates the episode query after success.

- Upload handling
  - Owns the selected file state.
  - Owns the upload button behavior and the submit flow.

- Local state
  - Keeps `selectedFile` in component state.
  - This is a good candidate for extraction into feature-local state orchestration.

- UI composition
  - Builds the detail layout inline in the page component.
  - Combines metadata display, audio preview, and upload UI in one place.

- Error/loading handling
  - Shows loading and error states directly from the route component.

### Feature responsibilities
The current Episode feature boundary already contains some ownership for create-flow concerns, but the detail flow is not yet fully represented there.

Existing feature assets:
- [apps/web/src/features/episodes/components/EpisodeCreateForm.tsx](../../apps/web/src/features/episodes/components/EpisodeCreateForm.tsx)
- [apps/web/src/features/episodes/hooks/useCreateEpisodeForm.ts](../../apps/web/src/features/episodes/hooks/useCreateEpisodeForm.ts)
- [apps/web/src/features/episodes/validators/episodeSchema.ts](../../apps/web/src/features/episodes/validators/episodeSchema.ts)
- [apps/web/src/features/episodes/components/EpisodeCard.tsx](../../apps/web/src/features/episodes/components/EpisodeCard.tsx)

Observed gap:
- The detail page is still route-owned rather than feature-owned.
- Episode-specific UI and interaction logic for viewing and uploading audio are not yet encapsulated under the feature boundary.

### Shared responsibilities
The following responsibilities should remain shared and not be moved into the feature boundary during this migration:

- API wrappers in [apps/web/src/lib/episodes.ts](../../apps/web/src/lib/episodes.ts) should remain shared.
- Shared UI primitives such as cards, buttons, loaders, and error states should remain shared.
- Authentication wrapper and route-level protections should remain outside the feature boundary.
- The existing audio playback mechanism should remain outside the scope of this migration unless a separate, explicit player architecture decision is made later.

## Migration Candidates

### Components to extract
The following UI responsibilities are the best candidates for extraction into the Episode feature layer:

- Episode detail view container
  - A feature-owned component that renders the episode header, metadata, and content section.

- Episode metadata display section
  - A component focused on showing title, description, podcast ID, publication state, and audio status.

- Episode audio upload section
  - A component focused on file selection, upload action, and upload feedback.

- Optional action area composition
  - If future UI needs evolve, the upload and status messaging can be separated into a dedicated action block.

### Hooks to extract
The following responsibilities are suitable for feature-local hooks:

- Episode detail query orchestration
  - A hook that owns the episode query, loading/error state, and data selection.

- Upload mutation orchestration
  - A hook that owns the upload mutation flow, pending state, success/error messaging, and refresh behavior.

- Local interaction state
  - A hook that manages the selected file and related interaction state for the upload UI.

These hooks should be proposed only as internal feature ownership; they should not be implemented in this planning phase.

## Player Boundary Check
This migration must not introduce any of the following into the Episode feature boundary:

- audio playback engine
- queue management
- global player state
- download manager
- a new player architecture

The boundary for this phase should remain narrow:

- Episode feature owns episode detail presentation and upload workflow.
- The route remains responsible for route param resolution and page entry.
- Any player-related behavior remains outside this migration and should be handled by a separate, explicit architecture decision if needed in the future.

## Target Structure
A future feature-oriented structure for this flow could look like:

```text
features/episodes/
  components/
    EpisodeDetailView.tsx
    EpisodeDetailMetaCard.tsx
    EpisodeAudioUploadCard.tsx
  hooks/
    useEpisodeDetail.ts
    useEpisodeAudioUpload.ts
  types/
  validators/
```

The route page should remain a thin entry point that:

- resolves the route param
- delegates UI composition to the feature layer
- preserves the current URL and route behavior

## Migration Order

### 1. First migration step
Extract the episode detail query and upload mutation orchestration into feature-local hooks.

This step should:
- keep the route page behavior intact
- preserve the current query keys and invalidation behavior
- preserve the current API calls through the shared lib layer

### 2. Second migration step
Extract the presentation into feature-owned components.

This step should:
- move the metadata and upload sections out of the route file
- preserve the existing UI order and visual structure
- keep the route page as a thin composition layer

### 3. Verification step
Validate that the migration preserved:
- route path behavior
- loading and error handling
- upload success and failure messaging
- API contracts
- the shared data layer

No new player or audio architecture should be introduced during verification.

## Risk Assessment

### Query risks
- The episode detail query may be sensitive to stale data or invalidation timing after upload.
- The migration should preserve the existing query key structure to avoid regressions.

### Upload risks
- The selected file state and pending mutation state must remain consistent after extraction.
- Upload success and error feedback should remain visible to the user.

### State risks
- Moving local state into hooks or child components may change lifecycle behavior if not preserved carefully.
- The migration should avoid unnecessary state restructuring.

### UI regression risks
- The current markup and class composition are part of the visible behavior.
- Extraction should preserve structure, semantics, and message text to avoid visual drift.

### Player coupling risks
- The detail page currently includes a native audio element, but this migration should not turn that into a global player integration.
- The migration boundary should stay focused on detail ownership and upload handling.

## Final Decision
READY FOR IMPLEMENTATION

Reason:
The current detail route is self-contained and the ownership boundaries are clear. The migration can be executed incrementally without changing routes, shared APIs, or player architecture. The plan is low-risk as long as the migration remains limited to presentation and orchestration ownership.
