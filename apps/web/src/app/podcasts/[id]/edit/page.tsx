'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PodcastForm } from '@/features/podcasts/PodcastForm';
import { PodcastFormFields } from '@/features/podcasts/components/PodcastFormFields';
import { usePodcast, useUpdatePodcast } from '@/features/podcasts/hooks/usePodcasts';
import { defaultPodcastFormValues, normalizePodcastFormValues, podcastFormSchema } from '@/features/podcasts/utils/podcastForm';
import type { PodcastFormValues } from '@/lib/types';

export default function EditPodcastPage() {
  const params = useParams();
  const podcastId = params?.id as string;
  const router = useRouter();
  const query = usePodcast(podcastId);
  const updateMutation = useUpdatePodcast();
  const form = useForm<PodcastFormValues>({
    resolver: zodResolver(podcastFormSchema),
    defaultValues: defaultPodcastFormValues,
  });

  useEffect(() => {
    if (query.data) {
      form.reset({
        title: query.data.title,
        rssUrl: query.data.rssUrl,
        description: query.data.description ?? '',
        website: query.data.website ?? '',
        artworkUrl: query.data.artworkUrl ?? '',
      });
    }
  }, [form, query.data]);

  async function onSubmit(values: PodcastFormValues) {
    try {
      const payload = normalizePodcastFormValues(values);
      await updateMutation.mutateAsync({ id: podcastId, payload });
      router.push(`/podcasts/${podcastId}`);
    } catch {
      // Error is surfaced by the mutation state below.
    }
  }

  if (query.isLoading) {
    return <LoadingState message="Loading podcast..." />;
  }

  if (query.isError || !query.data) {
    return <ErrorState message={query.error?.message ?? 'Podcast not found'} />;
  }

  return (
    <ProtectedRoute>
      <main className="page-container">
        <PodcastForm
          title="Edit Podcast"
          submitLabel="Save Changes"
          error={updateMutation.isError ? updateMutation.error?.message ?? 'Unable to update podcast' : null}
          isLoading={updateMutation.isPending}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <PodcastFormFields register={form.register} errors={form.formState.errors} />
        </PodcastForm>
      </main>
    </ProtectedRoute>
  );
}
