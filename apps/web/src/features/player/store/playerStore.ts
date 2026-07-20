import { create } from 'zustand';
import type { PlayableItem, PlayerPlaybackStatus, PlayerRepeatMode, PlayerRuntimeState } from '../types';

export type PlayerState = {
  currentItem: PlayableItem | null;
  queue: PlayableItem[];
  currentIndex: number;
  isPlaying: boolean;
  playbackStatus: PlayerPlaybackStatus;
  duration: number;
  currentPosition: number;
  error: string | null;
  volume: number;
  repeatMode: PlayerRepeatMode;
  shuffleEnabled: boolean;
  setCurrentItem: (item: PlayableItem) => void;
  setPlaybackState: (state: Partial<PlayerRuntimeState>) => void;
  replaceQueue: (items: PlayableItem[], startIndex?: number) => void;
  selectQueueItem: (index: number) => PlayableItem | null;
  removeQueueItem: (index: number) => void;
  clearQueue: () => void;
  goToNext: () => PlayableItem | null;
  goToPrevious: () => PlayableItem | null;
  setVolume: (volume: number) => void;
  toggleRepeat: () => void;
  setShuffle: (enabled: boolean) => void;
  toggleShuffle: () => void;
  resetPlayer: () => void;
};

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

export const usePlayerStore = create<PlayerState>((set) => ({
  currentItem: null,
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  playbackStatus: 'idle',
  duration: 0,
  currentPosition: 0,
  error: null,
  volume: 0.8,
  repeatMode: 'off',
  shuffleEnabled: false,
  setCurrentItem: (item) =>
    set((state) => {
      const queue = state.queue.length ? state.queue : [item];
      const foundIndex = queue.findIndex((queueItem) => queueItem.id === item.id);
      const safeIndex = foundIndex >= 0 ? foundIndex : state.currentIndex >= 0 && state.currentIndex < queue.length ? state.currentIndex : 0;

      return {
        ...state,
        currentItem: item,
        queue,
        currentIndex: safeIndex,
        isPlaying: true,
        playbackStatus: 'playing',
        currentPosition: 0,
        duration: 0,
        error: null,
      };
    }),
  setPlaybackState: (state) =>
    set((currentState) => {
      const hasPlaybackStatus = Object.prototype.hasOwnProperty.call(state, 'playbackStatus');
      const nextPlaybackStatus = hasPlaybackStatus ? state.playbackStatus ?? 'idle' : currentState.playbackStatus;
      const hasPosition = Object.prototype.hasOwnProperty.call(state, 'currentPosition');
      const nextPosition = hasPosition ? state.currentPosition ?? 0 : currentState.currentPosition;
      const hasDuration = Object.prototype.hasOwnProperty.call(state, 'duration');
      const nextDuration = hasDuration ? state.duration ?? 0 : currentState.duration;
      const hasError = Object.prototype.hasOwnProperty.call(state, 'error');
      const nextError = hasError ? (state.error ?? null) : currentState.error;

      return {
        ...currentState,
        ...state,
        playbackStatus: nextPlaybackStatus,
        currentPosition: nextPosition,
        duration: nextDuration,
        error: nextError,
        isPlaying: nextPlaybackStatus === 'playing',
      };
    }),
  replaceQueue: (items, startIndex = 0) =>
    set((state) => {
      const normalizedItems = items.filter(Boolean);
      const safeStartIndex = normalizedItems.length
        ? Math.max(0, Math.min(startIndex, normalizedItems.length - 1))
        : -1;
      const nextItem = safeStartIndex >= 0 ? normalizedItems[safeStartIndex] : null;

      return {
        ...state,
        queue: normalizedItems,
        currentIndex: safeStartIndex,
        currentItem: nextItem,
      };
    }),
  selectQueueItem: (index) => {
    let selectedItem: PlayableItem | null = null;

    set((state) => {
      if (!state.queue.length || index < 0 || index >= state.queue.length) {
        return state;
      }

      selectedItem = state.queue[index] ?? null;

      return {
        ...state,
        currentItem: selectedItem,
        currentIndex: index,
        isPlaying: true,
        playbackStatus: 'playing',
        currentPosition: 0,
        duration: 0,
        error: null,
      };
    });

    return selectedItem;
  },
  removeQueueItem: (index) =>
    set((state) => {
      if (!state.queue.length || index < 0 || index >= state.queue.length) {
        return state;
      }

      const nextQueue = state.queue.filter((_, queueIndex) => queueIndex !== index);
      const isRemovingCurrentItem = index === state.currentIndex;

      if (!nextQueue.length) {
        return {
          ...state,
          queue: [],
          currentIndex: -1,
          currentItem: null,
          isPlaying: false,
          playbackStatus: 'idle',
          currentPosition: 0,
          duration: 0,
          error: null,
        };
      }

      const nextIndex = isRemovingCurrentItem
        ? Math.max(0, Math.min(index, nextQueue.length - 1))
        : state.currentIndex > index
          ? state.currentIndex - 1
          : state.currentIndex;

      const nextCurrentItem = isRemovingCurrentItem ? nextQueue[nextIndex] : state.currentItem;

      return {
        ...state,
        queue: nextQueue,
        currentIndex: nextIndex,
        currentItem: nextCurrentItem,
        playbackStatus: isRemovingCurrentItem ? 'playing' : state.playbackStatus,
        isPlaying: isRemovingCurrentItem ? true : state.isPlaying,
        currentPosition: isRemovingCurrentItem ? 0 : state.currentPosition,
        duration: isRemovingCurrentItem ? 0 : state.duration,
        error: null,
      };
    }),
  clearQueue: () =>
    set((state) => ({
      ...state,
      queue: [],
      currentIndex: -1,
      currentItem: null,
      isPlaying: false,
      playbackStatus: 'idle',
      currentPosition: 0,
      duration: 0,
      error: null,
    })),
  goToNext: () => {
    let nextItem: PlayableItem | null = null;

    set((state) => {
      if (!state.queue.length) {
        return state;
      }

      if (state.repeatMode === 'one' && state.currentItem) {
        nextItem = state.currentItem;
        return state;
      }

      const currentIndex = state.currentIndex >= 0 && state.currentIndex < state.queue.length ? state.currentIndex : 0;

      if (state.shuffleEnabled) {
        const availableIndices = state.queue
          .map((_, index) => index)
          .filter((index) => index !== currentIndex);

        const targetIndex = availableIndices.length
          ? availableIndices[Math.floor(Math.random() * availableIndices.length)] ?? currentIndex
          : currentIndex;
        nextItem = state.queue[targetIndex] ?? null;

        return {
          ...state,
          currentItem: nextItem,
          currentIndex: targetIndex,
        };
      }

      const isAtEnd = currentIndex >= state.queue.length - 1;
      const shouldWrap = state.repeatMode === 'queue' && isAtEnd;

      if (!shouldWrap && isAtEnd) {
        return state;
      }

      const targetIndex = shouldWrap ? 0 : currentIndex + 1;
      const safeTargetIndex = targetIndex >= 0 && targetIndex < state.queue.length ? targetIndex : 0;
      nextItem = state.queue[safeTargetIndex] ?? null;

      return {
        ...state,
        currentItem: nextItem,
        currentIndex: safeTargetIndex,
      };
    });

    return nextItem;
  },
  goToPrevious: () => {
    let previousItem: PlayableItem | null = null;

    set((state) => {
      if (!state.queue.length) {
        return state;
      }

      const currentIndex = state.currentIndex >= 0 && state.currentIndex < state.queue.length ? state.currentIndex : 0;

      if (currentIndex <= 0) {
        return state;
      }

      const targetIndex = currentIndex - 1;
      previousItem = state.queue[targetIndex] ?? null;

      return {
        ...state,
        currentItem: previousItem,
        currentIndex: targetIndex,
      };
    });

    return previousItem;
  },
  setVolume: (volume) => set({ volume: clampVolume(volume) }),
  toggleRepeat: () =>
    set((state) => ({
      repeatMode: state.repeatMode === 'off' ? 'one' : state.repeatMode === 'one' ? 'queue' : 'off',
    })),
  setShuffle: (enabled) => set({ shuffleEnabled: enabled }),
  toggleShuffle: () => set((state) => ({ shuffleEnabled: !state.shuffleEnabled })),
  resetPlayer: () =>
    set({
      currentItem: null,
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      playbackStatus: 'idle',
      duration: 0,
      currentPosition: 0,
      error: null,
      volume: 0.8,
      repeatMode: 'off',
      shuffleEnabled: false,
    }),
}));
