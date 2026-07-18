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

  return {
    async loadItem(item) {
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
    destroy() {
      unsubscribe();
      engine.destroy();
    },
  };
}
