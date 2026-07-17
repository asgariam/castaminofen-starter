import { apiFetch } from './api';
import type { Episode } from './types';

export type CreateEpisodeInput = {
  podcastId: string;
  title: string;
  description?: string;
  publishedAt?: string;
};

export async function getEpisodes(): Promise<Episode[]> {
  return apiFetch<Episode[]>('episodes', {
    method: 'GET',
  });
}

export async function getEpisodeById(id: string): Promise<Episode> {
  return apiFetch<Episode>(`episodes/${id}`);
}

export async function createEpisode(payload: CreateEpisodeInput): Promise<Episode> {
  return apiFetch<Episode>('episodes', {
    method: 'POST',
    body: payload,
  });
}

export async function uploadEpisodeAudio(episodeId: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return apiFetch<{ audioUrl: string }>(`episodes/${episodeId}/audio`, {
    method: 'POST',
    body: formData,
  });
}
