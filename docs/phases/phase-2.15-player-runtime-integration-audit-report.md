# Phase 2.15 — Player Runtime Integration Audit Report

## Objective

This phase performs an audit-only review of the current Player runtime integration state. The goal is to verify whether the runtime foundation introduced in Phase 2.14 is correctly separated from Episode ownership, whether remaining playback ownership still exists in the Episode and shared layers, and whether the repository is ready for the first Player consumption migration.

---

## 1. Current Integration State

### Player Runtime

The current Player runtime foundation exists in the feature-owned layer:

- [apps/web/src/features/player/runtime/audioEngine.ts](../../apps/web/src/features/player/runtime/audioEngine.ts)
- [apps/web/src/features/player/runtime/playerRuntime.ts](../../apps/web/src/features/player/runtime/playerRuntime.ts)
- [apps/web/src/features/player/hooks/usePlayerRuntime.ts](../../apps/web/src/features/player/hooks/usePlayerRuntime.ts)
- [apps/web/src/features/player/store/playerStore.ts](../../apps/web/src/features/player/store/playerStore.ts)

From the repository inspection, the runtime is currently responsible for:

- creating a browser audio engine,
- loading and playing a playable item,
- updating playback state in the Player store,
- and tracking duration/current position/error state.

This is aligned with the intended boundary of a runtime layer. It does not import Episode internals directly and remains focused on playback lifecycle behavior.

### Episode Feature

The Episode feature remains responsible for:

- episode metadata display,
- audio upload workflow,
- and episode-specific presentation in [apps/web/src/features/episodes/components/EpisodeDetailView.tsx](../../apps/web/src/features/episodes/components/EpisodeDetailView.tsx).

The current detail view still renders a native HTML audio element directly. That means Episode presentation still owns the playback UI surface, even though the runtime controller itself now lives in the Player feature.

### Legacy Audio Player

The legacy shared component [apps/web/src/components/AudioPlayer.tsx](../../apps/web/src/components/AudioPlayer.tsx) still exists as a local, direct HTMLAudioElement-based implementation. It is not currently wired into the new Player runtime layer and appears to be a transitional component rather than an active integration point.

### Legacy Player Store

The legacy compatibility re-export [apps/web/src/stores/playerStore.ts](../../apps/web/src/stores/playerStore.ts) still points to the new Player feature store, which preserves import compatibility without introducing a new runtime path. This is a good compatibility measure, but it also means the old shared import location is still present and should be considered transitional rather than a long-term ownership boundary.

---

## 2. Remaining Coupling

The following remaining coupling points were identified:

1. Episode presentation still renders inline audio playback UI.
   - Evidence: [apps/web/src/features/episodes/components/EpisodeDetailView.tsx](../../apps/web/src/features/episodes/components/EpisodeDetailView.tsx)
   - Impact: Episode continues to own a playback-facing UI responsibility, which is a boundary leak from the perspective of the intended Player architecture.

2. Episode detail still exposes audio URL directly through the page model.
   - Evidence: [apps/web/src/features/episodes/components/EpisodeDetailView.tsx](../../apps/web/src/features/episodes/components/EpisodeDetailView.tsx)
   - Impact: This is acceptable for now because the Episode domain still owns content metadata, but it remains a coupling point if the Player later needs richer playable metadata.

3. The Player store retains a direct adapter dependency on Episode data through the current store setter.
   - Evidence: [apps/web/src/features/player/store/playerStore.ts](../../apps/web/src/features/player/store/playerStore.ts)
   - Impact: This is a lightweight coupling and is acceptable for the current foundation, but it is still a bridge between Episode and Player rather than a fully independent Player contract.

4. The shared legacy AudioPlayer component still contains direct audio behavior.
   - Evidence: [apps/web/src/components/AudioPlayer.tsx](../../apps/web/src/components/AudioPlayer.tsx)
   - Impact: It is not yet an active consumer of the new runtime, but it remains a potential source of duplicated playback logic if the project continues to expand.

---

## 3. Ownership Validation

### Ownership matrix

| Responsibility | Current Owner | Assessment |
| --- | --- | --- |
| Episode metadata | Episode feature | Correct |
| Episode CRUD / upload workflow | Episode feature | Correct |
| Audio upload | Episode feature | Correct |
| Playable mapping | Player adapter layer | Correct, but still lightweight |
| Playback lifecycle | Player runtime | Correct |
| Current playing item | Player store | Correct |
| Queue | Not implemented | Not applicable yet |
| Player UI | Not yet fully migrated | Partially remaining in Episode |
| Audio engine | Player runtime | Correct |

### Boundary conclusion

The runtime boundary is mostly correct. The Player runtime now owns playback lifecycle and state updates. The remaining issue is not the runtime itself, but the fact that Episode still owns some playback presentation and the shared legacy AudioPlayer still contains direct browser audio behavior.

---

## 4. Migration Risks

The following risks remain before a broader Player migration:

1. UI ownership drift
   - If Episode continues to render playback UI directly, the Player boundary will remain partially diluted.

2. Transitional shared component risk
   - The shared AudioPlayer component could continue to become a second playback surface unless it is clearly treated as legacy or temporary.

3. Contract maturity
   - The current playable contract is minimal and sufficient for initial runtime usage, but it is not yet a rich domain contract for advanced Player features.

4. Consumer migration complexity
   - The repo has a compatibility re-export and a legacy component, so the next migration should be done carefully to avoid behavior drift.

---

## 5. Recommendation

The repository is not yet ready for a full Player UI integration, but it appears to be in a reasonable state for a first consumption migration at the runtime boundary level.

### Recommended next step

Proceed with a first consumer migration only if the goal is to replace the old playback behavior with the new Player runtime in a controlled way, while preserving the existing Episode experience. The most logical next step is:

1. Keep Episode responsible for metadata and upload.
2. Move playback UI responsibility behind a Player-facing integration point.
3. Preserve the current runtime boundary and avoid introducing queue/history/offline/persistence responsibilities yet.

This is still a foundation-stage migration, not a full Player experience rollout.

---

## Final Decision

Status: READY FOR FIRST PLAYER CONSUMPTION MIGRATION

Reasoning:

- The Player runtime is structurally isolated from Episode internals.
- The runtime owns playback lifecycle and state tracking.
- The remaining coupling is limited to UI presentation and legacy transitional components.
- The repository does not yet need a provider or an expanded Player shell to begin a controlled first migration.

---

## Validation Summary

This phase did not introduce any code changes, route changes, API contract changes, dependency additions, or runtime behavior changes.
