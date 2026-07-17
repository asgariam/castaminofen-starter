import { useQuery } from '@tanstack/react-query';
import { getEpisodeById } from '@/lib/episodes';

const episodeDetailKey = (id?: string) => ['episode', id] as const;

export function useEpisodeDetail(episodeId: string) {
  return useQuery({
    queryKey: episodeDetailKey(episodeId),
    queryFn: () => getEpisodeById(episodeId),
    enabled: Boolean(episodeId),
  });
}

export { episodeDetailKey };
