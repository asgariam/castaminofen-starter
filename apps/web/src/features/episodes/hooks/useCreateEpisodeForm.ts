import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { createEpisode } from '@/lib/episodes';
import { getPodcasts } from '@/lib/podcasts';
import type { PaginatedResponse, Podcast } from '@/lib/types';
import { episodeSchema, type EpisodeFormValues } from '@/features/episodes/validators/episodeSchema';

export function useCreateEpisodeForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EpisodeFormValues>({
    resolver: zodResolver(episodeSchema),
  });

  const podcastsQuery = useQuery<PaginatedResponse<Podcast>, Error>({
    queryKey: ['podcasts'],
    queryFn: () => getPodcasts({ page: 1, limit: 50, sort: 'newest' }),
  });

  async function onSubmit(values: EpisodeFormValues) {
    setError(null);
    try {
      const episode = await createEpisode(values);
      router.push(`/episodes/${episode.id}`);
    } catch (err) {
      setError((err as Error).message || 'Unable to create episode');
    }
  }

  return {
    form,
    podcastsQuery,
    error,
    onSubmit,
  };
}
