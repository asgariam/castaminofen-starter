import * as z from 'zod';

export const episodeSchema = z.object({
  podcastId: z.string().min(1, 'Podcast is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  publishedAt: z.string().optional(),
});

export type EpisodeFormValues = z.infer<typeof episodeSchema>;
