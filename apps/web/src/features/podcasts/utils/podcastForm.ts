import * as z from 'zod';
import type { PodcastFormValues } from '@/lib/types';

export const podcastFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  rssUrl: z.string().url('Must be a valid URL'),
  description: z.string().trim().max(280, 'Description is too long').optional().or(z.literal('')),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  artworkUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export const defaultPodcastFormValues: PodcastFormValues = {
  title: '',
  rssUrl: '',
  description: '',
  website: '',
  artworkUrl: '',
};

export function normalizePodcastFormValues(values: PodcastFormValues): PodcastFormValues {
  return {
    ...values,
    description: values.description?.trim() || undefined,
    website: values.website?.trim() || undefined,
    artworkUrl: values.artworkUrl?.trim() || undefined,
  };
}
