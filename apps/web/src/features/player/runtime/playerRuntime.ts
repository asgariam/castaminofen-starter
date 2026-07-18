import { createBrowserAudioEngine } from './audioEngine';
import type { PlayableItem } from '../types';
import type { PlayerState } from '../store/playerStore';

export type PlayerRuntimeController = {
  loadItem(item: PlayableItem): Promise<void>;
  play(): Promise<void>;
  pause(): void;
  stop(): void;
  setVolume(volume: number): void;
  setCurrentTime(position: number): void;
  replaceQueue(items: PlayableItem[], startIndex?: number): Promise<void>;
  clearQueue(): void;
  next(): Promise<void>;
  previous(): Promise<void>;
  destroy(): void;
};

export function createPlayerRuntimeController(store: PlayerState): PlayerRuntimeController {
  const engine = createBrowserAudioEngine();

  const syncState = () => {
    store.setPlaybackState({
      currentPosition: engine.getCurrentTime(),
      duration: engine.getDuration(),
      error: null,
      playbackStatus: engine.getCurrentTime() > 0 && !engine.getDuration() ? 'playing' : 'paused',
    });
  };

  const unsubscribe = engine.subscribe(() => {
    syncState();
  });

  const playItem = async (item: PlayableItem) => {
    store.setCurrentItem(item);
    store.setPlaybackState({
      currentItem: item,
      playbackStatus: 'loading',
      duration: 0,
      currentPosition: 0,
      error: null,
    });

    engine.load(item.audioUrl);
    await engine.play();
    store.setPlaybackState({
      currentItem: item,
      playbackStatus: 'playing',
      duration: engine.getDuration(),
      currentPosition: engine.getCurrentTime(),
      error: null,
    });
  };

  return {
    async loadItem(item) {
      store.replaceQueue([item], 0);
      await playItem(item);
    },
    async play() {
      await engine.play();
      syncState();
    },
    pause() {
      engine.pause();
      syncState();
    },
    stop() {
      engine.stop();
      syncState();
    },
    setVolume(volume) {
      engine.setVolume(volume);
      store.setVolume(volume);
      syncState();
    },
    setCurrentTime(position) {
      engine.setCurrentTime(position);
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
      const nextItem = store.goToNext();

      if (!nextItem) {
        return;
      }

      await playItem(nextItem);
    },
    async previous() {
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
