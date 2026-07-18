export type PlayerPlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused';

export type PlayableSourceType = 'episode' | 'podcast' | 'library' | 'unknown';

export interface PlayableItem {
  id: string;
  title: string;
  subtitle?: string;
  audioUrl?: string;
  artworkUrl?: string;
  duration?: number;
  sourceType: PlayableSourceType;
}
