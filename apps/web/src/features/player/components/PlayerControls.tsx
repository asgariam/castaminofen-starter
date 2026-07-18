'use client';

import { ChevronLeft, ChevronRight, Pause, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayerRuntime } from '../hooks/usePlayerRuntime';
import { usePlayerState } from '../hooks/usePlayerState';

export function PlayerControls() {
  const playerRuntime = usePlayerRuntime();
  const { currentItem, status, isPlaying, queue, currentIndex } = usePlayerState();

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex >= 0 && currentIndex < queue.length - 1;

  const handleTogglePlayback = async () => {
    if (!currentItem?.audioUrl) {
      return;
    }

    if (status === 'playing') {
      playerRuntime.pause();
      return;
    }

    if (status === 'paused') {
      await playerRuntime.play();
      return;
    }

    await playerRuntime.loadItem(currentItem);
  };

  const handleStop = () => {
    playerRuntime.stop();
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-10 w-10 rounded-full p-0"
        onClick={() => void playerRuntime.previous()}
        disabled={!canGoPrevious || !currentItem?.audioUrl}
        aria-label="Previous item"
      >
        <ChevronLeft size={16} />
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="h-10 w-10 rounded-full p-0"
        onClick={() => void handleTogglePlayback()}
        disabled={!currentItem?.audioUrl}
        aria-label={isPlaying ? 'Pause playback' : 'Start playback'}
      >
        {status === 'loading' ? <span className="text-xs">...</span> : isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-10 w-10 rounded-full p-0"
        onClick={handleStop}
        disabled={!currentItem?.audioUrl}
        aria-label="Stop playback"
      >
        <Square size={14} />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-10 w-10 rounded-full p-0"
        onClick={() => void playerRuntime.next()}
        disabled={!canGoNext || !currentItem?.audioUrl}
        aria-label="Next item"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
