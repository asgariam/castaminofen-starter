'use client';

import { Pause, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayerRuntime } from '../hooks/usePlayerRuntime';
import { usePlayerState } from '../hooks/usePlayerState';

export function PlayerControls() {
  const playerRuntime = usePlayerRuntime();
  const { currentItem, status, isPlaying } = usePlayerState();

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
    </div>
  );
}
