import type { Episode, PaginatedResponse, PaginationMeta, Podcast, UserProfile } from '@castaminofen/shared-types';

export type { Episode, PaginatedResponse, PaginationMeta, Podcast, UserProfile };

export interface PodcastFormValues {
  title: string;
  rssUrl: string;
  description?: string;
  website?: string;
  artworkUrl?: string;
}
