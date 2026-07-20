'use client';

import { usePlayerRuntime } from '../hooks/usePlayerRuntime';
import { usePlayerState } from '../hooks/usePlayerState';
import { QueueListItem } from './QueueListItem';

export function QueueList({ onClose }: { onClose: () => void }) {
  const { queue, currentIndex } = usePlayerState();
  const playerRuntime = usePlayerRuntime();

  return (
    <div className="mt-4 space-y-2 overflow-y-auto pb-4">
      {queue.map((item, index) => (
        <QueueListItem
          key={item.id}
          item={item}
          index={index}
          isCurrent={index === currentIndex}
          onPlay={() => {
            void playerRuntime.selectQueueItem(index);
            onClose();
          }}
          onRemove={() => {
            void playerRuntime.removeQueueItem(index);
          }}
        />
      ))}
    </div>
  );
}
