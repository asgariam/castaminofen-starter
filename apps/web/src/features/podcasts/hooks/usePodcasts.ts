import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPodcast, deletePodcast, getPodcastById, getPodcasts, updatePodcast, type GetPodcastsQuery } from '@/lib/podcasts';

const podcastsKey = (params?: GetPodcastsQuery) => ['podcasts', params?.page ?? 1, params?.limit ?? 20, params?.search ?? '', params?.sort ?? 'newest'] as const;
const podcastDetailKey = (id?: string) => ['podcast', id] as const;

export function usePodcasts(query: GetPodcastsQuery = {}) {
  return useQuery({
    queryKey: podcastsKey(query),
    queryFn: () => getPodcasts(query),
    staleTime: 1000 * 30,
  });
}

export function usePodcast(id: string) {
  return useQuery({
    queryKey: podcastDetailKey(id),
    queryFn: () => getPodcastById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 30,
  });
}

export function useCreatePodcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPodcast,
    onSuccess: (podcast) => {
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
      queryClient.setQueryData(podcastDetailKey(podcast.id), podcast);
    },
  });
}

export function useUpdatePodcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updatePodcast>[1] }) => updatePodcast(id, payload),
    onSuccess: (podcast) => {
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
      queryClient.setQueryData(podcastDetailKey(podcast.id), podcast);
    },
  });
}

export function useDeletePodcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deletePodcast(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
      queryClient.removeQueries({ queryKey: podcastDetailKey(variables.id) });
    },
  });
}
