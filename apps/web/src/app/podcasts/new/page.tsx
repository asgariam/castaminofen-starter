'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormField, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PodcastForm } from '@/features/podcasts/PodcastForm';
import { useCreatePodcast } from '@/features/podcasts/hooks/usePodcasts';
import type { PodcastFormValues } from '@/lib/types';

const podcastSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  rssUrl: z.string().url('Must be a valid URL'),
  description: z.string().trim().max(280, 'Description is too long').optional().or(z.literal('')),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  artworkUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export default function NewPodcastPage() {
  const router = useRouter();
  const createMutation = useCreatePodcast();
  const form = useForm<PodcastFormValues>({
    resolver: zodResolver(podcastSchema),
    defaultValues: {
      title: '',
      rssUrl: '',
      description: '',
      website: '',
      artworkUrl: '',
    },
  });

  async function onSubmit(values: PodcastFormValues) {
    try {
      const payload = {
        ...values,
        description: values.description?.trim() || undefined,
        website: values.website?.trim() || undefined,
        artworkUrl: values.artworkUrl?.trim() || undefined,
      };
      const podcast = await createMutation.mutateAsync(payload);
      router.push(`/podcasts/${podcast.id}`);
    } catch {
      // Error is surfaced by the mutation state below.
    }
  }

  return (
    <ProtectedRoute>
      <main className="page-container">
        <PodcastForm
          title="New Podcast"
          submitLabel="Create Podcast"
          error={createMutation.isError ? createMutation.error?.message ?? 'Unable to create podcast' : null}
          isLoading={createMutation.isPending}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input id="title" {...form.register('title')} />
            {form.formState.errors.title ? <p className="error-text">{form.formState.errors.title.message}</p> : null}
          </FormField>
          <FormField>
            <FormLabel htmlFor="rssUrl">RSS URL</FormLabel>
            <Input id="rssUrl" {...form.register('rssUrl')} />
            {form.formState.errors.rssUrl ? <p className="error-text">{form.formState.errors.rssUrl.message}</p> : null}
          </FormField>
          <FormField>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Input id="description" {...form.register('description')} />
            {form.formState.errors.description ? <p className="error-text">{form.formState.errors.description.message}</p> : null}
          </FormField>
          <FormField>
            <FormLabel htmlFor="website">Website</FormLabel>
            <Input id="website" {...form.register('website')} />
            {form.formState.errors.website ? <p className="error-text">{form.formState.errors.website.message}</p> : null}
          </FormField>
          <FormField>
            <FormLabel htmlFor="artworkUrl">Artwork URL</FormLabel>
            <Input id="artworkUrl" {...form.register('artworkUrl')} />
            {form.formState.errors.artworkUrl ? <p className="error-text">{form.formState.errors.artworkUrl.message}</p> : null}
          </FormField>
        </PodcastForm>
      </main>
    </ProtectedRoute>
  );
}
