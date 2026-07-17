import { create } from 'zustand';
import type { Episode } from '@/lib/types';

export type PlayerState = {
  currentEpisode?: Episode;
  isPlaying: boolean;
  setCurrentEpisode: (episode: Episode) => void;
  togglePlay: () => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  currentEpisode: undefined,
  isPlaying: false,
  setCurrentEpisode: (episode) => set({ currentEpisode: episode, isPlaying: true }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));
