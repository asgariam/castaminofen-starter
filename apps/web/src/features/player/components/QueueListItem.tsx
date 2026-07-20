'use client';

import { KeyboardEvent } from 'react';
import { PauseCircle, PlayCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PlayableItem } from '../types';

export function QueueListItem({
  item,
  index,
  isCurrent,
  onPlay,
  onRemove,
}: {
  item: PlayableItem;
  index: number;
  isCurrent: boolean;
  onPlay: () => void;
  onRemove: () => void;
}) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onPlay();
    }
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border px-3 py-3 ${isCurrent ? 'border-accent/40 bg-accent/10' : 'border-border bg-surface-secondary/70'}`}
      role="listitem"
      aria-current={isCurrent ? 'true' : undefined}
      aria-label={`${item.title}${isCurrent ? ', now playing' : ''}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-tertiary text-text-secondary">
        {item.artworkUrl ? <img src={item.artworkUrl} alt="" aria-hidden="true" className="h-full w-full rounded-xl object-cover" /> : <PlayCircle size={18} />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-text-primary">{item.title}</p>
          {isCurrent ? <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent">Now playing</span> : null}
        </div>
        <p className="mt-1 truncate text-xs text-text-secondary">{item.subtitle ?? 'Queued episode'}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0" onClick={onPlay} aria-label={`Play ${item.title}`}>
          {isCurrent ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0" onClick={onRemove} aria-label={`Remove ${item.title}`}>
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}
