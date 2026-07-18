import type { Episode } from '@/lib/types';
import type { PlayableItem } from '../types';

export function mapEpisodeToPlayableItem(episode: Episode): PlayableItem {
  return {
    id: episode.id,
    title: episode.title,
    subtitle: episode.description,
    audioUrl: episode.audioUrl,
    artworkUrl: undefined,
    duration: undefined,
    sourceType: 'episode',
  };
}
