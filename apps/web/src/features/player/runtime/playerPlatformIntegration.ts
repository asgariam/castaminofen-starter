import { useEffect } from 'react';
import type { PlayableItem, PlayerPlaybackStatus } from '../types';
import type { PlayerRuntimeController } from './playerRuntime';

export type KeyboardShortcutAction = 'toggle-playback' | 'seek-forward' | 'seek-backward' | 'next-item' | 'previous-item';

export const buildMediaSessionMetadata = (item: PlayableItem | null) => {
  if (!item) {
    return null;
  }

  const artwork = item.artworkUrl
    ? [{ src: item.artworkUrl, sizes: '512x512', type: 'image/png' }]
    : [];

  const metadata = {
    title: item.title || 'Untitled episode',
    artist: item.subtitle || 'Castaminofen',
    artwork,
  };

  if (typeof window !== 'undefined' && 'MediaMetadata' in window) {
    return new window.MediaMetadata(metadata);
  }

  return metadata;
};

export const shouldIgnoreKeyboardShortcut = (target: EventTarget | null) => {
  if (!target) {
    return false;
  }

  const tagName = typeof target === 'object' && 'tagName' in target ? String((target as { tagName?: string }).tagName ?? '').toLowerCase() : '';
  const isContentEditable = typeof target === 'object' && 'isContentEditable' in target ? Boolean((target as { isContentEditable?: boolean }).isContentEditable) : false;

  if (typeof Element !== 'undefined' && target instanceof Element) {
    return Boolean(target.closest('input, textarea, select, [contenteditable="true"], [contenteditable=""], [contenteditable], [role="dialog"], dialog'));
  }

  return Boolean(
    tagName === 'input' ||
      tagName === 'textarea' ||
      tagName === 'select' ||
      tagName === 'button' && isContentEditable ||
      isContentEditable
  );
};

export const resolveKeyboardShortcutAction = (event: KeyboardEvent): KeyboardShortcutAction | null => {
  if (event.altKey || event.ctrlKey || event.metaKey) {
    return null;
  }

  if (event.key === ' ' || event.key === 'Spacebar' || event.code === 'Space') {
    return 'toggle-playback';
  }

  if (event.key === 'ArrowRight' || event.key === 'Right') {
    return event.shiftKey ? 'next-item' : 'seek-forward';
  }

  if (event.key === 'ArrowLeft' || event.key === 'Left') {
    return event.shiftKey ? 'previous-item' : 'seek-backward';
  }

  return null;
};

type UsePlayerPlatformIntegrationOptions = {
  playerRuntime: PlayerRuntimeController;
  currentItem: PlayableItem | null;
  playbackStatus: PlayerPlaybackStatus;
  currentPosition: number;
  isPlaying: boolean;
};

export function usePlayerPlatformIntegration({ playerRuntime, currentItem, playbackStatus, currentPosition, isPlaying }: UsePlayerPlatformIntegrationOptions) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaSession = navigator.mediaSession;

    if (mediaSession) {
      const metadata = buildMediaSessionMetadata(currentItem);
      if (metadata) {
        mediaSession.metadata = metadata as MediaMetadata;
      }

      mediaSession.playbackState = isPlaying ? 'playing' : playbackStatus === 'paused' ? 'paused' : 'none';

      mediaSession.setActionHandler('play', () => {
        void playerRuntime.play();
      });
      mediaSession.setActionHandler('pause', () => {
        playerRuntime.pause();
      });
      mediaSession.setActionHandler('nexttrack', () => {
        void playerRuntime.next();
      });
      mediaSession.setActionHandler('previoustrack', () => {
        void playerRuntime.previous();
      });
      mediaSession.setActionHandler('seekbackward', () => {
        playerRuntime.setCurrentTime(Math.max(0, currentPosition - 10));
      });
      mediaSession.setActionHandler('seekforward', () => {
        playerRuntime.setCurrentTime(currentPosition + 10);
      });
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      if (shouldIgnoreKeyboardShortcut(event.target)) {
        return;
      }

      const action = resolveKeyboardShortcutAction(event);
      if (!action) {
        return;
      }

      event.preventDefault();

      switch (action) {
        case 'toggle-playback': {
          if (playbackStatus === 'playing' || isPlaying) {
            playerRuntime.pause();
            break;
          }

          if (currentItem?.audioUrl) {
            if (playbackStatus === 'paused') {
              void playerRuntime.play();
            } else {
              void playerRuntime.loadItem(currentItem);
            }
          }
          break;
        }
        case 'seek-forward':
          playerRuntime.setCurrentTime(currentPosition + 10);
          break;
        case 'seek-backward':
          playerRuntime.setCurrentTime(Math.max(0, currentPosition - 10));
          break;
        case 'next-item':
          void playerRuntime.next();
          break;
        case 'previous-item':
          void playerRuntime.previous();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (mediaSession) {
        mediaSession.setActionHandler('play', null);
        mediaSession.setActionHandler('pause', null);
        mediaSession.setActionHandler('nexttrack', null);
        mediaSession.setActionHandler('previoustrack', null);
        mediaSession.setActionHandler('seekbackward', null);
        mediaSession.setActionHandler('seekforward', null);
      }
    };
  }, [currentItem, currentPosition, isPlaying, playbackStatus, playerRuntime]);
}
