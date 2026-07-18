# Phase 2.17 — Player Consumption Implementation Report

## Objective

Implement the first real Player Runtime consumer migration for episode playback by shifting playback ownership from the Episode presentation layer to the existing Player runtime boundary through the playable contract.

## Files Changed

- [apps/web/src/features/episodes/components/EpisodeDetailView.tsx](../../apps/web/src/features/episodes/components/EpisodeDetailView.tsx)

## Ownership Changes

Before:
- Episode presentation owned the direct audio-element lifecycle and playback trigger.

After:
- Episode presentation now provides a playable item and dispatches playback through the Player runtime boundary.
- Player runtime remains the owner of playback lifecycle, state, and audio engine interaction.

## Dependency Direction After Migration

```text
Episode
  -> episodeToPlayable adapter
  -> Player runtime action
  -> audio engine
```

## Legacy AudioPlayer Decision

The existing legacy component at [apps/web/src/components/AudioPlayer.tsx](../../apps/web/src/components/AudioPlayer.tsx) was reviewed and left in place because it is not currently used by the episode detail flow. No deletion or relocation was performed to avoid unintended behavior changes.

## Runtime Impact

- Existing routes remained unchanged.
- Existing episode data flow remained unchanged.
- Existing upload workflow remained unchanged.
- The UI structure of the episode detail page stayed intact.
- Direct HTML audio ownership was removed from the Episode presentation component.

## Validation Results

Executed:
- pnpm --filter @castaminofen/web lint
- pnpm --filter @castaminofen/web build

Result:
- Lint passed with no ESLint warnings or errors.
- Build passed successfully and generated the episode route without regressions.

## Known Limitations

- This phase intentionally does not introduce a full Player UI, queue, persistence, or offline behavior.
- The migration is limited to the first consumer path and preserves the current episode detail experience.

## Suggested Next Phase

Phase 2.18 can focus on consolidating player UI state and expanding the runtime contract for richer player interactions while keeping the current episode route and API behavior stable.
