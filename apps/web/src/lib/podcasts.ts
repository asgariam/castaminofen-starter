import { apiFetch } from './api';
import type { PaginatedResponse, Podcast } from './types';

export type GetPodcastsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: 'newest';
};

export type CreatePodcastInput = {
  title: string;
  rssUrl: string;
  description?: string;
  website?: string;
  artworkUrl?: string;
};

export async function getPodcasts(query: GetPodcastsQuery = {}): Promise<PaginatedResponse<Podcast>> {
  return apiFetch<PaginatedResponse<Podcast>>('podcasts', {
    method: 'GET',
    query,
  });
}

export async function getPodcastById(id: string): Promise<Podcast> {
  return apiFetch<Podcast>(`podcasts/${id}`);
}

export async function createPodcast(payload: CreatePodcastInput): Promise<Podcast> {
  return apiFetch<Podcast>('podcasts', {
    method: 'POST',
    body: payload,
  });
}

export async function updatePodcast(id: string, payload: Partial<CreatePodcastInput>): Promise<Podcast> {
  return apiFetch<Podcast>(`podcasts/${id}`, {
    method: 'PUT',
    body: payload,
  });
}

export async function deletePodcast(id: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`podcasts/${id}`, {
    method: 'DELETE',
  });
}
