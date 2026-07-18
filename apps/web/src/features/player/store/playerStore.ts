import { create } from 'zustand';
import type { Episode } from '@/lib/types';
import { mapEpisodeToPlayableItem } from '../adapters/episodeToPlayable';
import type { PlayableItem, PlayerPlaybackStatus, PlayerRuntimeState } from '../types';

export type PlayerState = {
  currentItem: PlayableItem | null;
  currentEpisode?: Episode | null;
  isPlaying: boolean;
  playbackStatus: PlayerPlaybackStatus;
  status: PlayerPlaybackStatus;
  duration: number;
  currentPosition: number;
  position: number;
  error: string | null;
  volume: number;
  repeatMode: 'off' | 'one' | 'all';
  shuffle: boolean;
  setCurrentEpisode: (episode: Episode) => void;
  setCurrentItem: (item: PlayableItem) => void;
  setPlaybackState: (state: Partial<PlayerRuntimeState>) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  resetPlayer: () => void;
};

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

export const usePlayerStore = create<PlayerState>((set) => ({
  currentItem: null,
  currentEpisode: null,
  isPlaying: false,
  playbackStatus: 'idle',
  status: 'idle',
  duration: 0,
  currentPosition: 0,
  position: 0,
  error: null,
  volume: 0.8,
  repeatMode: 'off',
  shuffle: false,
  setCurrentEpisode: (episode) => {
    const playableItem = mapEpisodeToPlayableItem(episode);

    set({
      currentItem: playableItem,
      currentEpisode: episode,
      isPlaying: true,
      playbackStatus: 'playing',
      status: 'playing',
      currentPosition: 0,
      position: 0,
      duration: 0,
      error: null,
    });
  },
  setCurrentItem: (item) =>
    set({
      currentItem: item,
      currentEpisode: null,
      isPlaying: true,
      playbackStatus: 'playing',
      status: 'playing',
      currentPosition: 0,
      position: 0,
      duration: 0,
      error: null,
    }),
  setPlaybackState: (state) =>
    set((currentState) => {
      const nextPlaybackStatus = state.playbackStatus ?? currentState.playbackStatus;
      const nextPosition = state.currentPosition ?? currentState.currentPosition;
      const nextDuration = state.duration ?? currentState.duration;
      const nextError = state.error ?? currentState.error;

      return {
        ...currentState,
        ...state,
        playbackStatus: nextPlaybackStatus,
        status: nextPlaybackStatus,
        currentPosition: nextPosition,
        position: nextPosition,
        duration: nextDuration,
        error: nextError,
        isPlaying: nextPlaybackStatus === 'playing',
      };
    }),
  togglePlay: () =>
    set((state) => {
      const nextPlaybackStatus = state.isPlaying ? 'paused' : 'playing';

      return {
        isPlaying: !state.isPlaying,
        playbackStatus: nextPlaybackStatus,
        status: nextPlaybackStatus,
      };
    }),
  setVolume: (volume) => set({ volume: clampVolume(volume) }),
  toggleRepeat: () =>
    set((state) => ({
      repeatMode: state.repeatMode === 'off' ? 'all' : state.repeatMode === 'all' ? 'one' : 'off',
    })),
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  resetPlayer: () =>
    set({
      currentItem: null,
      currentEpisode: null,
      isPlaying: false,
      playbackStatus: 'idle',
      status: 'idle',
      duration: 0,
      currentPosition: 0,
      position: 0,
      error: null,
      volume: 0.8,
      repeatMode: 'off',
      shuffle: false,
    }),
}));
