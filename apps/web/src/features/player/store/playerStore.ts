import { create } from 'zustand';
import type { Episode } from '@/lib/types';
import { mapEpisodeToPlayableItem } from '../adapters/episodeToPlayable';
import type { PlayableItem, PlayerPlaybackStatus } from '../types';

export type PlayerState = {
  currentItem: PlayableItem | null;
  currentEpisode?: Episode | null;
  isPlaying: boolean;
  playbackStatus: PlayerPlaybackStatus;
  volume: number;
  repeatMode: 'off' | 'one' | 'all';
  shuffle: boolean;
  setCurrentEpisode: (episode: Episode) => void;
  setCurrentItem: (item: PlayableItem) => void;
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
    });
  },
  setCurrentItem: (item) =>
    set({
      currentItem: item,
      currentEpisode: null,
      isPlaying: true,
      playbackStatus: 'playing',
    }),
  togglePlay: () =>
    set((state) => ({
      isPlaying: !state.isPlaying,
      playbackStatus: state.isPlaying ? 'paused' : 'playing',
    })),
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
      volume: 0.8,
      repeatMode: 'off',
      shuffle: false,
    }),
}));
