# Phase 3.5 — Player Queue Experience Foundation Report

## Objective
Implement the first user-facing Queue experience on top of the existing Player architecture without introducing new abstractions or changing Episode/API ownership.

## Implemented Work
- Added Player-owned queue selection and removal actions to the Player store.
- Extended the Player runtime controller with minimal queue actions for selecting and removing queued items.
- Added a lightweight Queue sheet UI that opens from the existing compact Player bar.
- Exposed queue controls for play, remove, and clear actions while preserving the existing Player architecture.
- Added regression tests covering queue selection, non-current removal, current-item removal, final-item removal, and queue clearing.

## Files Changed
- apps/web/src/features/player/store/playerStore.ts
- apps/web/src/features/player/runtime/playerRuntime.ts
- apps/web/src/features/player/runtime/playerRuntime.test.ts
- apps/web/src/features/player/components/PlayerBar.tsx
- apps/web/src/features/player/components/PlayerControls.tsx
- apps/web/src/features/player/components/PlayerProgress.tsx
- apps/web/src/features/player/components/QueueSheet.tsx
- apps/web/src/features/player/components/QueueList.tsx
- apps/web/src/features/player/components/QueueListItem.tsx
- apps/web/src/features/player/components/QueueEmptyState.tsx

## Runtime Changes
- Added `selectQueueItem(index)` to allow the UI to start playback for another queued item.
- Added `removeQueueItem(index)` to allow the UI to remove items without changing ownership boundaries.
- When removing the current item, the runtime now transitions to the next available queued item when possible; otherwise it returns to an idle state gracefully.

## Store Changes
- Added `selectQueueItem(index)` and `removeQueueItem(index)` to the Player store.
- Kept queue ownership inside the Player store and preserved deterministic queue order.
- Maintained currentIndex/currentItem/repeatMode/shuffleEnabled semantics.

## UI Changes
- Added a Queue button to the Player bar controls.
- Added a Player-owned Queue sheet with queue list, current-item highlight, play/remove controls, and a Clear action.
- Added an empty-state view for an empty queue.

## Validation
- Verified queue item selection updates currentItem/currentIndex.
- Verified removing a non-current item preserves the current playback state.
- Verified removing the current item advances to the next available item or stops gracefully when the queue is empty.
- Verified clearing the queue resets the Player state to idle.

## Test Results
- Executed: `pnpm exec tsx --test apps/web/src/features/player/runtime/playerRuntime.test.ts`
- Result: 10 tests passed, 0 failed.

## Known Limitations
- The queue UI is intentionally lightweight and does not introduce persistence, drag-and-drop ordering, or playlist management.
- Queue rendering is currently a mobile-first sheet and simple desktop panel; it does not redesign the existing Player experience.

## Next Recommended Step
- If desired, the next phase can add queue persistence or richer queue interactions while keeping the same Player-owned architecture.
