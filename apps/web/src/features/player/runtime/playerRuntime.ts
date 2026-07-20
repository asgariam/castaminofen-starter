import { createBrowserAudioEngine, type AudioEngine } from './audioEngine';
import type { PlayableItem, PlayerPlaybackStatus } from '../types';
import { usePlayerStore, type PlayerState } from '../store/playerStore';

export type PlayerRuntimeController = {
  loadItem(item: PlayableItem): Promise<void>;
  play(): Promise<void>;
  pause(): void;
  stop(): void;
  setVolume(volume: number): void;
  setCurrentTime(position: number): void;
  replaceQueue(items: PlayableItem[], startIndex?: number): Promise<void>;
  selectQueueItem(index: number): Promise<void>;
  removeQueueItem(index: number): Promise<void>;
  clearQueue(): void;
  next(): Promise<void>;
  previous(): Promise<void>;
  destroy(): void;
};

export function createPlayerRuntimeController(store: PlayerState, engine: AudioEngine = createBrowserAudioEngine()): PlayerRuntimeController {
  // Token used to ignore outdated load/play completions when multiple
  // rapid load/play requests happen. Incrementing this token makes earlier
  // promises no-ops so they don't overwrite newer state.
  let currentLoadToken = 0;
  const getLatestState = () => usePlayerStore.getState();

  const syncState = (snapshot?: { playbackStatus: PlayerPlaybackStatus; duration: number; currentPosition: number; error: string | null }) => {
    store.setPlaybackState({
      currentPosition: snapshot?.currentPosition ?? engine.getCurrentTime(),
      duration: snapshot?.duration ?? engine.getDuration(),
      error: snapshot?.error ?? null,
      playbackStatus: snapshot?.playbackStatus ?? 'paused',
    });
  };

  const stopPlaybackGracefully = (snapshot?: { playbackStatus: PlayerPlaybackStatus; duration: number; currentPosition: number; error: string | null }) => {
    const finalPosition = snapshot?.currentPosition ?? engine.getCurrentTime();
    const finalDuration = snapshot?.duration ?? engine.getDuration();
    const latestState = getLatestState();

    engine.stop();
    store.setPlaybackState({
      currentItem: latestState.currentItem,
      playbackStatus: 'idle',
      duration: finalDuration,
      currentPosition: finalPosition,
      error: snapshot?.error ?? null,
    });
  };

  const playItem = async (item: PlayableItem) => {
    const loadToken = ++currentLoadToken;
    if (!item.audioUrl) {
      store.setCurrentItem(item);
      store.setPlaybackState({
        currentItem: item,
        playbackStatus: 'idle',
        duration: 0,
        currentPosition: 0,
        error: 'Audio source is unavailable.',
      });
      engine.stop();
      return;
    }

    store.setCurrentItem(item);
    store.setPlaybackState({
      currentItem: item,
      playbackStatus: 'loading',
      duration: 0,
      currentPosition: 0,
      error: null,
    });

    engine.load(item.audioUrl);

    try {
      await engine.play();

      // Ignore results from earlier loads/plays if another load started
      // after this one.
      if (loadToken !== currentLoadToken) return;

      store.setPlaybackState({
        currentItem: item,
        playbackStatus: 'playing',
        duration: engine.getDuration(),
        currentPosition: engine.getCurrentTime(),
        error: null,
      });
    } catch (error) {
      // If a newer load has been requested, avoid overwriting state.
      if (loadToken !== currentLoadToken) return;

      store.setPlaybackState({
        currentItem: item,
        playbackStatus: 'paused',
        duration: engine.getDuration(),
        currentPosition: engine.getCurrentTime(),
        error: 'Unable to start playback.',
      });
      throw error;
    }
  };

  const moveToNextQueueItem = async () => {
    const latestState = getLatestState();

    if (!latestState.queue.length) {
      stopPlaybackGracefully({
        playbackStatus: 'idle',
        duration: engine.getDuration(),
        currentPosition: engine.getCurrentTime(),
        error: null,
      });
      return;
    }

    if (latestState.repeatMode === 'one' && latestState.currentItem) {
      await playItem(latestState.currentItem);
      return;
    }

    const nextItem = store.goToNext();

    if (!nextItem) {
      stopPlaybackGracefully({
        playbackStatus: 'idle',
        duration: engine.getDuration(),
        currentPosition: engine.getCurrentTime(),
        error: null,
      });
      return;
    }

    await playItem(nextItem);
  };

  const unsubscribe = engine.subscribe((snapshot) => {
    const latestState = getLatestState();

    if (snapshot.playbackStatus === 'idle' && snapshot.currentPosition > 0 && latestState.currentItem && latestState.isPlaying) {
      void moveToNextQueueItem();
      return;
    }

    if (snapshot.error) {
      store.setPlaybackState({
        playbackStatus: snapshot.playbackStatus,
        duration: snapshot.duration,
        currentPosition: snapshot.currentPosition,
        error: snapshot.error,
      });
      return;
    }

    syncState(snapshot);
  });

  return {
    async loadItem(item) {
      store.replaceQueue([item], 0);
      await playItem(item);
    },
    async play() {
      const latestState = getLatestState();

      if (!latestState.currentItem?.audioUrl) {
        store.setPlaybackState({
          playbackStatus: 'idle',
          duration: 0,
          currentPosition: 0,
          error: latestState.currentItem ? 'Audio source is unavailable.' : 'No playable item selected.',
        });
        engine.stop();
        return;
      }

      const token = currentLoadToken;

      try {
        await engine.play();

        // if a newer load started while we were waiting, ignore the result
        if (token !== currentLoadToken) return;

        syncState();
      } catch (error) {
        if (token !== currentLoadToken) return;

        store.setPlaybackState({
          playbackStatus: 'paused',
          duration: engine.getDuration(),
          currentPosition: engine.getCurrentTime(),
          error: 'Unable to start playback.',
        });
        throw error;
      }
    },
    pause() {
      engine.pause();
      syncState();
    },
    stop() {
      const latestState = getLatestState();

      engine.stop();
      store.setPlaybackState({
        currentItem: latestState.currentItem,
        playbackStatus: 'idle',
        duration: engine.getDuration(),
        currentPosition: 0,
        error: null,
      });
    },
    setVolume(volume) {
      engine.setVolume(volume);
      store.setVolume(volume);
      syncState();
    },
    setCurrentTime(position) {
      const safePosition = Number.isFinite(position) ? Math.max(0, position) : 0;
      engine.setCurrentTime(safePosition);
      syncState();
    },
    async replaceQueue(items, startIndex = 0) {
      if (!items.length) {
        store.clearQueue();
        store.setPlaybackState({
          currentItem: null,
          playbackStatus: 'idle',
          duration: 0,
          currentPosition: 0,
          error: null,
        });
        engine.stop();
        return;
      }

      const targetIndex = Math.max(0, Math.min(startIndex, items.length - 1));
      const targetItem = items[targetIndex] ?? items[0];

      store.replaceQueue(items, targetIndex);
      await playItem(targetItem);
    },
    async selectQueueItem(index) {
      const targetItem = store.selectQueueItem(index);

      if (!targetItem?.audioUrl) {
        store.setPlaybackState({
          currentItem: targetItem,
          playbackStatus: 'idle',
          duration: 0,
          currentPosition: 0,
          error: targetItem ? 'Audio source is unavailable.' : 'No playable item selected.',
        });
        engine.stop();
        return;
      }

      await playItem(targetItem);
    },
    async removeQueueItem(index) {
      const currentItemId = getLatestState().currentItem?.id;
      store.removeQueueItem(index);
      const latestState = getLatestState();

      if (!latestState.queue.length) {
        store.setPlaybackState({
          currentItem: null,
          playbackStatus: 'idle',
          duration: 0,
          currentPosition: 0,
          error: null,
        });
        engine.stop();
        return;
      }

      const isCurrentItemRemoved = currentItemId ? latestState.currentItem?.id !== currentItemId : false;

      if (isCurrentItemRemoved) {
        const nextItem = latestState.currentItem;
        if (!nextItem?.audioUrl) {
          store.setPlaybackState({
            currentItem: nextItem,
            playbackStatus: 'idle',
            duration: 0,
            currentPosition: 0,
            error: nextItem ? 'Audio source is unavailable.' : null,
          });
          engine.stop();
          return;
        }

        await playItem(nextItem);
      }
    },
    clearQueue() {
      store.clearQueue();
      store.setPlaybackState({
        currentItem: null,
        playbackStatus: 'idle',
        duration: 0,
        currentPosition: 0,
        error: null,
      });
      engine.stop();
    },
    async next() {
      await moveToNextQueueItem();
    },
    async previous() {
      const latestState = getLatestState();

      if (!latestState.queue.length) {
        stopPlaybackGracefully({
          playbackStatus: 'idle',
          duration: engine.getDuration(),
          currentPosition: engine.getCurrentTime(),
          error: null,
        });
        return;
      }

      const previousItem = store.goToPrevious();

      if (!previousItem) {
        return;
      }

      await playItem(previousItem);
    },
    destroy() {
      unsubscribe();
      engine.destroy();
    },
  };
}
