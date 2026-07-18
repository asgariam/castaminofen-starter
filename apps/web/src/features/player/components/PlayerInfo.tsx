'use client';

import { usePlayerState } from '../hooks/usePlayerState';

export function PlayerInfo() {
  const { currentItem, status } = usePlayerState();

  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-text-primary">
        {currentItem?.title ?? 'No active playback'}
      </p>
      <p className="truncate text-xs text-text-secondary">
        {currentItem?.subtitle ?? (status === 'idle' ? 'Choose an episode to start listening.' : 'Playback available')}
      </p>
    </div>
  );
}
