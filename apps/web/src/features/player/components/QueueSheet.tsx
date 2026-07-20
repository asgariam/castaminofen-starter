'use client';

import { ListMusic, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayerRuntime } from '../hooks/usePlayerRuntime';
import { usePlayerState } from '../hooks/usePlayerState';
import { QueueList } from './QueueList';
import { QueueEmptyState } from './QueueEmptyState';

export function QueueSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const playerRuntime = usePlayerRuntime();
  const { queue, currentItem } = usePlayerState();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/40" role="presentation" onClick={onClose}>
      <div
        className="absolute inset-x-0 bottom-0 rounded-t-3xl border border-border bg-surface-primary p-4 shadow-soft md:inset-y-0 md:right-0 md:left-auto md:w-[24rem] md:rounded-none md:rounded-l-3xl"
        role="dialog"
        aria-modal="true"
        aria-label="Queue"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text-primary">Queue</p>
            <p className="text-xs text-text-secondary">{queue.length} item{queue.length === 1 ? '' : 's'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0" onClick={onClose} aria-label="Close queue">
              <X size={16} />
            </Button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-surface-secondary/70 px-3 py-2">
          <div className="flex items-center gap-2">
            <ListMusic size={16} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">{currentItem ? 'Now playing' : 'Queue ready'}</span>
          </div>
          <Button type="button" variant="ghost" size="sm" className="px-3" onClick={() => playerRuntime.clearQueue()} disabled={!queue.length}>
            <Trash2 size={14} className="me-2" />
            Clear
          </Button>
        </div>

        {queue.length ? <QueueList onClose={onClose} /> : <QueueEmptyState onClose={onClose} />}
      </div>
    </div>
  );
}
