# Phase 2.12 — Player Readiness Audit

## Objective

This phase performs an audit-only review of the current frontend architecture to determine whether the repository is ready for Player feature implementation based on the ownership boundaries defined in the prior Player-related planning documents.

---

## Current State

### Existing implementation

The current repository already contains the early foundations for player-related behavior, but they remain transitional and scattered:

- [apps/web/src/components/AudioPlayer.tsx](../../apps/web/src/components/AudioPlayer.tsx) contains a simple browser-based audio player with local play/pause state and a direct HTMLAudioElement reference.
- [apps/web/src/stores/playerStore.ts](../../apps/web/src/stores/playerStore.ts) defines a global Zustand store for current episode, playback state, volume, repeat, and shuffle.
- [apps/web/src/features/episodes/components/EpisodeDetailView.tsx](../../apps/web/src/features/episodes/components/EpisodeDetailView.tsx) still renders an inline audio element directly in the Episode detail UI.
- [apps/web/src/features/episodes/hooks/useEpisodeAudioUpload.ts](../../apps/web/src/features/episodes/hooks/useEpisodeAudioUpload.ts) and [apps/web/src/features/episodes/components/EpisodeAudioUploadCard.tsx](../../apps/web/src/features/episodes/components/EpisodeAudioUploadCard.tsx) keep audio upload responsibilities inside the Episode feature, which is appropriate for now.

### Ownership map

- Player-related ownership is currently mixed:
  - Shared/transitional ownership: the generic audio UI and global player store.
  - Episode ownership: episode metadata display, upload workflow, and episode-specific presentation.
  - Shared application foundation: provider architecture and app shell are already in place and can support a future Player integration layer.

### Architecture status

The repository is structurally prepared for a future Player feature in a limited sense:

- The app shell is already mobile-first and RTL-aware.
- React Query and global state infrastructure are present.
- The ownership boundaries are documented, but they are not yet enforced by a dedicated Player feature boundary in code.

---

## Findings

### Finding 1 — Playback responsibility is still coupled to Episode presentation

- Issue: The Episode detail view renders an inline audio element directly, so playback UI is still part of the Episode feature experience.
- Impact: This creates a boundary violation for the intended future ownership model. It makes the Episode feature responsible for playback presentation even though the Player feature should own playback lifecycle.
- Recommendation: Keep Episode focused on metadata and episode-specific workflows. Introduce a Player-facing integration point later so the Episode feature only passes a playable contract to the Player layer.

### Finding 2 — Player state exists, but it is not yet feature-scoped and contract-driven

- Issue: [apps/web/src/stores/playerStore.ts](../../apps/web/src/stores/playerStore.ts) contains playback state, but it is still a generic global store tied to the Episode type directly.
- Impact: This is workable for MVP, but it risks becoming a broad application state container if the Player expands into queueing, history, persistence, or media-session integration.
- Recommendation: Preserve the current store as a transitional starting point, but plan a future Player-specific store and a broader playable abstraction rather than continuing to couple it to Episode directly.

### Finding 3 — The shared layer is not yet polluted, but it contains transitional Player responsibilities

- Issue: [apps/web/src/components/AudioPlayer.tsx](../../apps/web/src/components/AudioPlayer.tsx) is currently a shared UI component with direct playback logic.
- Impact: This is acceptable as a temporary foundation, but it should not be expanded into a general-purpose shared player component because that would blur feature ownership.
- Recommendation: Treat this as a transitional component only. Avoid adding episode-specific UI or playback logic into general shared components.

### Finding 4 — The current Episode data contract is sufficient for basic playback, but not for a robust Player experience

- Issue: The shared Episode model in [packages/shared-types/src/index.ts](../../packages/shared-types/src/index.ts) includes basic fields such as title, description, audioUrl, and publication metadata, but it lacks richer playable contract fields.
- Impact: Basic playback is possible, but the model will likely need extension for duration, stream type, fallback sources, media metadata, or queue-related fields as the Player becomes more capable.
- Recommendation: The current Episode data is sufficient for MVP audio playback, but a dedicated playable abstraction should be introduced before scaling into advanced Player behavior.

### Finding 5 — UI foundation is mostly ready for a Player shell, but the Player surface itself is not yet implemented

- Issue: The app shell, bottom navigation, and mobile container in [apps/web/src/components/layout/app-shell.tsx](../../apps/web/src/components/layout/app-shell.tsx) and [apps/web/src/components/layout/bottom-navigation.tsx](../../apps/web/src/components/layout/bottom-navigation.tsx) support a mobile-first experience, and the layout is already RTL-aware.
- Impact: The application foundation can support a persistent mini player or a full-player sheet without major structural rework.
- Recommendation: The UI foundation is ready, but the actual mini player and player sheet surfaces still need to be introduced as a dedicated Player feature layer.

### Finding 6 — State architecture is suitable for a split between server state and local player state

- Issue: React Query is already used for episode data fetching, and Zustand is used for local UI state.
- Impact: This is a good fit for separating server-owned episode data from ephemeral playback state.
- Recommendation: Keep React Query responsible for fetching and caching episode data, and keep player state in a dedicated Player store or provider-owned state slice.

### Finding 7 — There is no immediate circular dependency risk, but boundary discipline is still required

- Issue: The current structure does not show obvious circular dependency patterns, but there is a risk of accidental coupling if the Player becomes too dependent on Episode internals or if Episode begins to own playback lifecycle.
- Impact: Future implementation could create feature-boundary drift if the architecture is not enforced early.
- Recommendation: Keep the Player feature independent from Episode internals and use a simple data adapter layer rather than direct imports of Episode implementation details.

---

## Player Implementation Readiness Score

### Status: Not Ready

### Reasoning

The repository has a workable foundation, but it is not yet fully ready for full Player implementation because:

- playback ownership is still partially embedded in the Episode feature,
- the current Player state is transitional rather than feature-scoped,
- the current data contract is sufficient for basic playback but not yet structured as a dedicated playable contract,
- and the Player feature itself does not yet have a clear, independent implementation boundary in code.

---

## Recommended Next Step

### Option B — Introduce missing foundation first

Before implementing the full Player experience, the safest next step is to prepare the missing architecture foundation:

1. Define a dedicated Player feature boundary in code.
2. Introduce a simple playable contract or adapter between Episode data and Player state.
3. Establish a Player-specific state layer and keep Episode presentation free of playback lifecycle responsibilities.
4. Prepare the UI shell for a future mini player or full-player sheet without changing runtime behavior yet.

---

## Validation

This phase did not introduce any code changes, runtime changes, API changes, or dependency changes.

The audit was limited to analysis and documentation only, in accordance with the phase requirements.
