'use client';

import { ListMusic } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function QueueEmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface-secondary/60 p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-tertiary text-text-secondary">
        <ListMusic size={20} />
      </div>
      <p className="mt-4 text-sm font-semibold text-text-primary">Your queue is empty</p>
      <p className="mt-1 text-sm text-text-secondary">Add episodes to the queue and they will appear here.</p>
      <Button type="button" variant="secondary" size="sm" className="mt-4" onClick={onClose}>
        Close
      </Button>
    </div>
  );
}
